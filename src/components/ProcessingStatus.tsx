import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';

interface ProcessingStatusProps {
  data: any;
  onComplete: (results: any) => void;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ data, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { name: 'File Processing', description: 'Preparing your file for analysis', duration: 2000 },
    { name: 'Smart Transcription', description: 'Converting audio to text with speaker identification', duration: 4000 },
    { name: 'Content Analysis', description: 'Extracting insights, action items, and decisions', duration: 3000 },
    { name: 'Sentiment Analysis', description: 'Analyzing meeting dynamics and engagement', duration: 2000 },
    { name: 'Report Generation', description: 'Finalizing your comprehensive meeting analysis', duration: 1500 }
  ];

  useEffect(() => {
    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        
        // Animate progress for current step
        const stepDuration = steps[i].duration;
        const startTime = Date.now();
        
        const progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const stepProgress = Math.min((elapsed / stepDuration) * 100, 100);
          setProgress((i * 100 + stepProgress) / steps.length);
        }, 100);
        
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        clearInterval(progressInterval);
      }
      
      // Complete processing and generate mock results
      const results = generateMockResults(data);
      onComplete(results);
    };

    processSteps();
  }, [data, onComplete]);

  const generateMockResults = (inputData: any) => {
    return {
      metadata: {
        fileId: inputData.fileId,
        fileName: inputData.fileName,
        processedAt: new Date().toISOString(),
        duration: 3600,
        participants: 4
      },
      transcript: {
        fullText: "Welcome everyone to our quarterly review meeting. Let's start by discussing our Q3 performance metrics. Sarah, can you walk us through the numbers? Certainly, John. Our revenue for Q3 exceeded targets by 15%, reaching $2.8 million. The customer acquisition cost has decreased by 12% compared to last quarter, which is excellent news. That's fantastic work, Sarah. What about our product development timeline? Mike, can you give us an update? We're on track to launch the new dashboard feature by the end of October. However, we'll need additional QA resources to ensure quality. I can help coordinate that. Lisa, can you work with Mike to identify the resource requirements by Friday? Absolutely, I'll prepare a detailed resource plan. Now, let's discuss our Q4 strategy. We need to focus on expanding our European market presence. I propose we increase our marketing budget by 25% for the European campaign.",
        segments: [
          {
            speaker: "John (Host)",
            text: "Welcome everyone to our quarterly review meeting. Let's start by discussing our Q3 performance metrics. Sarah, can you walk us through the numbers?",
            startTime: 0,
            endTime: 8.5,
            confidence: 0.95
          },
          {
            speaker: "Sarah (Finance)",
            text: "Certainly, John. Our revenue for Q3 exceeded targets by 15%, reaching $2.8 million. The customer acquisition cost has decreased by 12% compared to last quarter, which is excellent news.",
            startTime: 8.5,
            endTime: 22.1,
            confidence: 0.92
          },
          {
            speaker: "John (Host)",
            text: "That's fantastic work, Sarah. What about our product development timeline? Mike, can you give us an update?",
            startTime: 22.1,
            endTime: 28.7,
            confidence: 0.94
          },
          {
            speaker: "Mike (Engineering)",
            text: "We're on track to launch the new dashboard feature by the end of October. However, we'll need additional QA resources to ensure quality.",
            startTime: 28.7,
            endTime: 39.2,
            confidence: 0.89
          },
          {
            speaker: "John (Host)",
            text: "I can help coordinate that. Lisa, can you work with Mike to identify the resource requirements by Friday?",
            startTime: 39.2,
            endTime: 46.8,
            confidence: 0.96
          },
          {
            speaker: "Lisa (Operations)",
            text: "Absolutely, I'll prepare a detailed resource plan. Now, let's discuss our Q4 strategy.",
            startTime: 46.8,
            endTime: 53.5,
            confidence: 0.91
          }
        ],
        speakers: ["John (Host)", "Sarah (Finance)", "Mike (Engineering)", "Lisa (Operations)"]
      },
      summary: {
        executive: "Q3 performance exceeded targets with 15% revenue growth and improved customer acquisition efficiency, while Q4 planning focuses on European expansion.",
        keyPoints: [
          "Q3 revenue exceeded targets by 15%, reaching $2.8 million",
          "Customer acquisition cost decreased by 12% compared to last quarter",
          "New dashboard feature on track for end-of-October launch",
          "Additional QA resources needed for product quality assurance",
          "Q4 strategy focuses on European market expansion",
          "Proposed 25% increase in marketing budget for European campaign"
        ],
        topics: ["Performance Review", "Product Development", "Resource Planning", "Market Expansion"]
      },
      actionItems: [
        {
          id: "action-1",
          task: "Prepare detailed QA resource requirements plan",
          assignee: "Lisa (Operations)",
          deadline: "Friday, September 13, 2024",
          priority: "high",
          context: "For the new dashboard feature launch",
          confidence: 0.94
        },
        {
          id: "action-2",
          task: "Coordinate additional QA resources allocation",
          assignee: "John (Host)",
          deadline: "Next week",
          priority: "medium",
          context: "Supporting product development timeline",
          confidence: 0.87
        },
        {
          id: "action-3",
          task: "Finalize European marketing budget proposal",
          assignee: "Sarah (Finance)",
          deadline: "September 20, 2024",
          priority: "medium",
          context: "25% increase for Q4 European expansion",
          confidence: 0.82
        }
      ],
      decisions: [
        {
          id: "decision-1",
          decision: "Approved Q4 European market expansion strategy",
          category: "strategic",
          confidence: "high",
          context: "Unanimous agreement to focus on European expansion",
          participants: ["John", "Sarah", "Mike", "Lisa"]
        },
        {
          id: "decision-2",
          decision: "Increase marketing budget by 25% for European campaign",
          category: "resource",
          confidence: "medium",
          context: "Proposed increase pending final budget approval",
          participants: ["John", "Sarah"]
        }
      ],
      sentiment: {
        overall: {
          sentiment: "positive",
          score: 0.72,
          confidence: 0.89
        },
        timeline: [
          { time: 0, sentiment: 0.6, topics: ["Meeting Opening"] },
          { time: 300, sentiment: 0.8, topics: ["Performance Review"] },
          { time: 600, sentiment: 0.7, topics: ["Product Development"] },
          { time: 900, sentiment: 0.75, topics: ["Resource Planning"] },
          { time: 1200, sentiment: 0.65, topics: ["Budget Discussion"] }
        ],
        speakers: {
          "John (Host)": { averageSentiment: 0.7, engagement: 0.85, dominance: 30 },
          "Sarah (Finance)": { averageSentiment: 0.8, engagement: 0.75, dominance: 25 },
          "Mike (Engineering)": { averageSentiment: 0.6, engagement: 0.65, dominance: 20 },
          "Lisa (Operations)": { averageSentiment: 0.75, engagement: 0.8, dominance: 25 }
        }
      }
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Processing Your Meeting
          </h2>
          <p className="text-lg text-gray-600">
            Our intelligent system is analyzing your content to extract actionable insights
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-black h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Processing Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const isPending = index > currentStep;

              return (
                <div 
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                    isCompleted ? 'bg-green-50 border border-green-200' :
                    isCurrent ? 'bg-blue-50 border border-blue-200 shadow-md' :
                    'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-black text-white' :
                    isCurrent ? 'bg-gray-800 text-white' :
                    'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : isCurrent ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Clock className="w-6 h-6" />
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className={`font-semibold ${
                      isCompleted ? 'text-green-800' :
                      isCurrent ? 'text-blue-800' :
                      'text-gray-600'
                    }`}>
                      {step.name}
                    </h3>
                    <p className={`text-sm ${
                      isCompleted ? 'text-green-600' :
                      isCurrent ? 'text-blue-600' :
                      'text-gray-500'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  
                  <div className={`text-sm font-medium ${
                    isCompleted ? 'text-green-600' :
                    isCurrent ? 'text-blue-600' :
                    'text-gray-400'
                  }`}>
                    {isCompleted ? 'Complete' : isCurrent ? 'Processing...' : 'Pending'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Estimated Time */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              <span className="font-medium">Processing File:</span> {data.fileName}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Estimated time remaining: {Math.max(0, 5 - Math.floor(progress / 20))} minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;