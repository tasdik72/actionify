import React, { useState, useMemo } from 'react';
import { Search, Users, Clock, Volume2, AlertCircle } from 'lucide-react';

interface Segment {
  id: string;
  speaker: string;
  text: string;
  start: number;
  end: number;
  confidence?: number;
}

interface Speaker {
  id: string;
  name: string;
}

interface TranscriptViewProps {
  data: {
    fullText?: string;
    segments?: Segment[];
    speakers?: Speaker[];
    wordCount?: number;
  };
}

const TranscriptView: React.FC<TranscriptViewProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('all');

  // Process segments with fallbacks
  const { segments, speakers, hasData } = useMemo(() => {
    const defaultSegments = data.fullText ? [{
      id: 'seg-0',
      speaker: 'Speaker 1',
      text: data.fullText,
      start: 0,
      end: 60, // Default 1 minute
      confidence: 1
    }] : [];

    const safeSpeakers = data.speakers?.length ? data.speakers : 
      [{ id: 'spk-1', name: 'Speaker 1' }];
    const safeSegments = data.segments?.length ? data.segments : defaultSegments;

    return {
      segments: safeSegments,
      speakers: safeSpeakers,
      hasData: Boolean(safeSegments.length || data.fullText)
    };
  }, [data]);

  const filteredSegments = useMemo(() => {
    if (!segments?.length) return [];
    return segments.filter((segment) => {
      const matchesSearch = segment.text?.toLowerCase().includes(searchTerm.toLowerCase()) ?? true;
      const matchesSpeaker = selectedSpeaker === 'all' || segment.speaker === selectedSpeaker;
      return matchesSearch && matchesSpeaker;
    });
  }, [segments, searchTerm, selectedSpeaker]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSpeakerColor = (speaker: string) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-orange-100 text-orange-800 border-orange-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200'
    ];
    const speakerId = speaker.toLowerCase().replace(/[^a-z0-9]/g, '');
    const index = [...speakerId].reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  if (!hasData) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h3 className="font-medium">No transcript data available</h3>
            <p className="text-sm mt-1">The meeting transcript could not be generated. This could be due to:
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Audio quality issues</li>
                <li>No speech detected</li>
                <li>Processing error</li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search transcript..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={selectedSpeaker}
          onChange={(e) => setSelectedSpeaker(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Speakers</option>
          {speakers.map((speaker) => (
            <option key={speaker.id} value={speaker.name}>{speaker.name}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center space-x-3">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">Speakers</p>
            <p className="text-xl font-semibold text-gray-900">{speakers.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center space-x-3">
          <Volume2 className="w-8 h-8 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Segments</p>
            <p className="text-xl font-semibold text-gray-900">{segments.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center space-x-3">
          <Clock className="w-8 h-8 text-purple-600" />
          <div>
            <p className="text-sm text-gray-600">Word Count</p>
            <p className="text-xl font-semibold text-gray-900">
              {data.wordCount ? data.wordCount.toLocaleString() : 
               data.fullText ? data.fullText.split(/\s+/).length : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Transcript Segments */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Volume2 className="w-5 h-5 mr-2 text-blue-600" />
          Transcript ({filteredSegments.length} segments)
        </h3>
        
        <div className="space-y-3">
          {filteredSegments.map((segment: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSpeakerColor(segment.speaker)}`}>
                    {segment.speaker}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      segment.confidence >= 0.9 ? 'bg-green-500' :
                      segment.confidence >= 0.8 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    <span className="text-xs text-gray-500">
                      {Math.round(segment.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {segment.text}
              </p>
            </div>
          ))}
          
          {filteredSegments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No segments match your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranscriptView;