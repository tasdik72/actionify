import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Check, Loader2 } from 'lucide-react';
import UploadSection from '../components/UploadSection';
import ResultsDashboard from '../components/ResultsDashboard';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { startTranscription, pollTranscription } from '../services/assemblyAIService';
import { analyzeMeetingContent, generateSentimentAnalysis } from '../services/openRouterService';

const AppPage: React.FC = () => {
  const location = useLocation();
  const initialUpload = (location.state as any)?.uploadData;

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [steps, setSteps] = useState<Array<{ name: string; status: 'pending'|'current'|'done' }>>([
    { name: 'Uploading', status: 'pending' },
    { name: 'Transcribing', status: 'pending' },
    { name: 'Analyzing Content', status: 'pending' },
    { name: 'Analyzing Sentiment', status: 'pending' },
    { name: 'Complete', status: 'pending' }
  ]);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleError = (message: string, err?: any) => {
    console.error(message, err);
    setError(message);
    toast.error(message);
  };

  const processData = async (data: any) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Initialize all steps as pending
      setSteps(prev => prev.map(s => ({ ...s, status: 'pending' })));
      
      // Step 1: Upload media file if provided
      setCurrentStep('Uploading');
      setSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'current' } : s));
      setProgress(10);
      
      let audioUrl: string | undefined;
      let transcriptText = data.text as string | undefined;
      
      // Always process through transcription service for audio/video files
      if (data.type === 'file' && data.file) {
        audioUrl = await uploadToCloudinary(data.file);
        
        if (!audioUrl) throw new Error('Failed to upload media file');
        
        // Step 2: Transcribe the audio
        setCurrentStep('Transcribing');
        setSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'done' } : i === 1 ? { ...s, status: 'current' } : s));
        setProgress(30);
        
        let transcript;
        try {
          const transcriptId = await startTranscription(audioUrl);
          transcript = await pollTranscription(transcriptId);
          
          if (transcript.status !== 'completed') {
            throw new Error(`Transcription failed with status: ${transcript.status}`);
          }
          
          // Get the full transcript with speaker diarization if available
          transcriptText = transcript.text || '';
          
          // Extract speaker information from words array
          const speakerSet = new Set<string>();
          const wordsWithSpeakers = (transcript.words || []).filter((word: any) => word?.speaker);
          
          wordsWithSpeakers.forEach((word: any) => {
            if (word?.speaker) {
              speakerSet.add(word.speaker);
            }
          });
          
          const speakerCount = Math.max(1, speakerSet.size); // Ensure at least 1 speaker
          
          // Create segments from words
          const segments = [];
          let currentSegment: any = null;
          
          for (const word of wordsWithSpeakers) {
            if (!currentSegment || currentSegment.speaker !== word.speaker) {
              if (currentSegment) {
                segments.push(currentSegment);
              }
              currentSegment = {
                speaker: word.speaker || 'Speaker 1',
                text: word.text || '',
                start: (word.start || 0) / 1000, // Convert ms to seconds
                end: (word.end || 0) / 1000,
                confidence: word.confidence || 0.9
              };
            } else {
              currentSegment.text = [currentSegment.text, word.text].filter(Boolean).join(' ');
              currentSegment.end = (word.end || 0) / 1000; // Update end time
              if (word.confidence !== undefined) {
                currentSegment.confidence = Math.min(
                  currentSegment.confidence || 1, 
                  word.confidence
                );
              }
            }
          }
          
          if (currentSegment) {
            segments.push(currentSegment);
          }
          
          // Store the processed transcript data for later use
          data.transcriptData = {
            ...transcript,
            segments: segments.length > 0 ? segments : [{
              speaker: 'Speaker 1',
              text: transcriptText,
              start: 0,
              end: 30, // Default 30s duration if we can't determine
              confidence: 0.9
            }],
            speakerCount
          };
        } catch (error) {
          console.error('Transcription error:', error);
          // Fallback to basic transcript if available
          if (transcript?.text) {
            transcriptText = transcript.text;
            data.transcriptData = {
              ...transcript,
              segments: [{
                speaker: 'Speaker 1',
                text: transcriptText,
                start: 0,
                end: 30,
                confidence: 0.8
              }],
              speakerCount: 1
            };
          } else {
            throw new Error('Failed to transcribe audio. Please try again.');
          }
        }
      } else if (!transcriptText) {
        throw new Error('No valid input provided');
      }

      // Step 3: Analyze Content
      setCurrentStep('Analyzing Content');
      setSteps(prev => prev.map((s, i) => i === 1 ? { ...s, status: 'done' } : i === 2 ? { ...s, status: 'current' } : s));
      setProgress(60);
      
      // Ensure we have transcript text at this point
      if (!transcriptText) {
        throw new Error('No transcript text available for analysis');
      }
      
      // Run content analysis
      const analysis = await analyzeMeetingContent(transcriptText).catch((e) => {
        console.error('Content analysis failed, using fallback', e);
        return { 
          summary: { 
            executive: 'Could not generate summary', 
            keyPoints: ['Content analysis failed'], 
            topics: [] 
          }, 
          actionItems: [], 
          decisions: [] 
        };
      });
      
      // Step 4: Analyze Sentiment (mandatory)
      setCurrentStep('Analyzing Sentiment');
      setSteps(prev => prev.map((s, i) => i === 2 ? { ...s, status: 'done' } : i === 3 ? { ...s, status: 'current' } : s));
      setProgress(80);
      
      // Ensure we have text to analyze
      const textToAnalyze = transcriptText || data.transcriptData?.segments?.map((s: { text: string }) => s.text).join(' ') || 'No transcript available';
      
      // Always get sentiment, with retry and fallback
      let sentiment;
      try {
        sentiment = await generateSentimentAnalysis(textToAnalyze);
        
        // Validate the sentiment response
        if (!sentiment || typeof sentiment !== 'object') {
          throw new Error('Invalid sentiment response');
        }
        
        // Ensure required fields exist
        sentiment = {
          overall: {
            sentiment: sentiment?.overall?.sentiment || 'neutral',
            score: typeof sentiment?.overall?.score === 'number' ? 
                   Math.max(-1, Math.min(1, sentiment.overall.score)) : 0, // Clamp score between -1 and 1
            confidence: typeof sentiment?.overall?.confidence === 'number' ? 
                       Math.max(0, Math.min(1, sentiment.overall.confidence)) : 0.5 // Clamp confidence between 0 and 1
          },
          speakers: sentiment.speakers || {}
        };
        
      } catch (error) {
        console.error('Sentiment analysis failed, using fallback:', error);
        // Fallback sentiment analysis
        const words = textToAnalyze.toLowerCase().split(/\s+/);
        const positiveWords = words.filter((w: string) => ['good', 'great', 'excellent', 'happy', 'awesome'].includes(w));
        const negativeWords = words.filter((w: string) => ['bad', 'terrible', 'awful', 'sad', 'poor'].includes(w));
        
        const score = Math.max(-1, Math.min(1, (positiveWords.length - negativeWords.length) * 0.2));
        
        sentiment = {
          overall: {
            sentiment: score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral',
            score,
            confidence: 0.8
          },
          speakers: {}
        };
      }
      
      // Get duration from transcript or estimate
      let duration = 0;
      if (data.transcriptData?.audio_duration) {
        duration = Math.ceil(data.transcriptData.audio_duration);
      } else {
        // Estimate from word count (150 words per minute)
        const wordCount = transcriptText.split(/\s+/).length;
        duration = Math.max(30, Math.ceil(wordCount / 2.5));
      }
      
      // Determine participant count from most reliable source
      let participantCount = 0;
      if (data.transcriptData?.speakerCount) {
        // From speaker diarization if available
        participantCount = data.transcriptData.speakerCount;
      } else if (sentiment?.speakers) {
        // From sentiment analysis
        participantCount = Object.keys(sentiment.speakers).length;
      } else {
        // Estimate from word count (1 speaker per ~300 words, max 5)
        const wordCount = transcriptText.split(/\s+/).length;
        participantCount = Math.max(1, Math.min(5, Math.ceil(wordCount / 300)));
      }
      
      // Use pre-processed segments or create fallback segments
      let segments = data.transcriptData?.segments || [];
      
      // If no segments from transcription, create from text
      if (segments.length === 0 && transcriptText) {
        const sentences = transcriptText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        segments = sentences.map((text, i) => ({
          id: `seg-${i}`,
          start: Math.floor((i * duration) / Math.max(1, sentences.length)),
          end: Math.floor(((i + 1) * duration) / Math.max(1, sentences.length)),
          text: text.trim(),
          speaker: `Speaker ${(i % participantCount) + 1}`,
          confidence: 1.0
        }));
      }
      
      // Prepare the final result data
      const resultData = {
        metadata: {
          fileId: data.fileId || `file-${Date.now()}`,
          fileName: data.fileName || (data.file ? data.file.name : 'Text Input'),
          processedAt: new Date().toISOString(),
          duration,
          participants: participantCount
        },
        transcript: {
          fullText: transcriptText,
          segments,
          speakers: Array.from({ length: participantCount }, (_, i) => ({
            id: `spk-${i + 1}`,
            name: `Speaker ${i + 1}`
          }))
        },
        summary: analysis.summary || {
          executive: '',
          keyPoints: [],
          topics: []
        },
        actionItems: analysis.actionItems || [],
        decisions: analysis.decisions || [],
        sentiment: {
          ...sentiment,
          overall: {
            sentiment: sentiment?.overall?.sentiment || 'neutral',
            score: sentiment?.overall?.score || 0.5,
            confidence: sentiment?.overall?.confidence || 0.5
          },
          speakers: sentiment?.speakers || {}
        }
      };

      setResults(resultData);
      setProgress(100);
      setCurrentStep('Complete');
      setSteps(prev => prev.map((s, i) => i < 4 ? { ...s, status: 'done' } : i === 4 ? { ...s, status: 'done' } : s));
      toast.success('Analysis complete');
    } catch (err: any) {
      handleError(err?.message || 'Processing failed', err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (initialUpload) {
      processData(initialUpload);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <UploadSection onFileUploaded={processData} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {(isProcessing || currentStep) && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div className="bg-black h-2 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
            </div>

            {/* Steps list */}
            <div className="space-y-3">
              {steps.map((s, idx) => (
                <div key={s.name} className={`flex items-center justify-between p-4 rounded-lg border ${
                  s.status === 'current' 
                    ? 'border-black bg-gray-50' 
                    : s.status === 'done' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-white opacity-70'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      s.status === 'current' 
                        ? 'bg-black text-white' 
                        : s.status === 'done' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-500'
                    }`}>
                      {s.status === 'current' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : s.status === 'done' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-medium">{idx + 1}</span>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      s.status === 'current' 
                        ? 'text-gray-900' 
                        : s.status === 'done' 
                          ? 'text-gray-900' 
                          : 'text-gray-500'
                    }`}>
                      {s.name}
                    </span>
                  </div>
                  <span className={`text-xs font-medium ${
                    s.status === 'current' 
                      ? 'text-gray-900' 
                      : s.status === 'done' 
                        ? 'text-green-600' 
                        : 'text-gray-400'
                  }`}>
                    {s.status === 'current' ? 'In progress' : s.status === 'done' ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {results && (
          <ResultsDashboard results={results} onStartOver={() => setResults(null)} />
        )}
      </div>
    </div>
  );
};

export default AppPage;

