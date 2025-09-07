import React, { useMemo } from 'react';
import { TrendingUp, Users, BarChart3, Heart, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface SentimentData {
  sentiment: string;
  score: number;
  confidence: number;
  timeline?: Array<{
    time: number;
    sentiment: number;
    topics?: string[];
  }>;
}

interface SpeakerStats {
  averageSentiment: number;
  engagement: number;
  dominance: number;
}

interface SentimentViewProps {
  data: {
    overall?: Partial<SentimentData>;
    speakers?: Record<string, SpeakerStats>;
    timeline?: Array<{
      time: number;
      sentiment: number;
      topics?: string[];
    }>;
  } | null | undefined;
}

const SentimentView: React.FC<SentimentViewProps> = ({ data }) => {
  // Process data with fallbacks
  const { hasData, overall, timeline, speakerData } = useMemo(() => {
    if (!data) return { 
      hasData: false, 
      overall: null, 
      timeline: [],
      speakerData: []
    };
    
    const defaultOverall = {
      sentiment: 'neutral' as const,
      score: 0,
      confidence: 0
    };

    const safeOverall = data.overall ? { ...defaultOverall, ...data.overall } : defaultOverall;
    const safeSpeakers = data.speakers || {};
    const safeTimeline = data.timeline || [];

    return {
      hasData: true,
      overall: safeOverall,
      timeline: safeTimeline,
      speakerData: Object.entries(safeSpeakers).map(([speaker, stats]) => ({
        name: speaker.split(' ')[0], // First name only for chart
        fullName: speaker,
        sentiment: Math.round((stats.averageSentiment || 0) * 100),
        engagement: Math.round((stats.engagement || 0) * 100),
        dominance: stats.dominance || 0
      }))
    };
  }, [data]);

  if (!hasData) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h3 className="font-medium">No sentiment data available</h3>
            <p className="text-sm mt-1">
              Sentiment analysis could not be performed. This could be due to insufficient or unclear content.
            </p>
          </div>
        </div>
      </div>
    );
  }
  const getSentimentColor = (sentiment: string | number) => {
    if (typeof sentiment === 'string') {
      switch (sentiment) {
        case 'positive': return 'text-green-600';
        case 'negative': return 'text-red-600';
        default: return 'text-gray-600';
      }
    } else {
      if (sentiment > 0.2) return 'text-green-600';
      if (sentiment < -0.2) return 'text-red-600';
      return 'text-gray-600';
    }
  };

  const getSentimentBg = (sentiment: string | number) => {
    if (typeof sentiment === 'string') {
      switch (sentiment) {
        case 'positive': return 'bg-green-100 border-green-200';
        case 'negative': return 'bg-red-100 border-red-200';
        default: return 'bg-gray-100 border-gray-200';
      }
    } else {
      if (sentiment > 0.2) return 'bg-green-100 border-green-200';
      if (sentiment < -0.2) return 'bg-red-100 border-red-200';
      return 'bg-gray-100 border-gray-200';
    }
  };

  const processedTimeline = timeline.map(point => ({
    time: `${Math.floor(point.time / 60)}:${(point.time % 60).toString().padStart(2, '0')}`,
    sentiment: Math.round(point.sentiment * 100),
    topics: point.topics?.join(', ') || ''
  }));

  return (
    <div className="space-y-8">
      {/* Overall Sentiment */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-green-600" />
          Overall Meeting Sentiment
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${getSentimentColor(overall.sentiment)}`}>
              {overall.sentiment?.charAt(0).toUpperCase() + overall.sentiment?.slice(1) || 'Neutral'}
            </div>
            <p className="text-sm text-gray-600">Primary Tone</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {(overall.score * 100).toFixed(0)}
            </div>
            <p className="text-sm text-gray-600">Sentiment Score</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {(overall.confidence * 100).toFixed(0)}%
            </div>
            <p className="text-sm text-gray-600">Confidence</p>
          </div>
        </div>
      </div>

      {/* Sentiment Timeline */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Sentiment Over Time
        </h3>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[-100, 100]} />
              <Tooltip 
                formatter={(value: any, name: any) => [
                  `${value}%`, 
                  name === 'sentiment' ? 'Sentiment Score' : name
                ]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="sentiment" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Speaker Analysis */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-purple-600" />
          Speaker Analysis
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sentiment by Speaker */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Sentiment by Speaker</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={speakerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[-100, 100]} />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Sentiment']}
                  labelFormatter={(label) => {
                    const speaker = speakerData.find(s => s.name === label);
                    return speaker ? speaker.fullName : label;
                  }}
                />
                <Bar dataKey="sentiment" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement by Speaker */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Engagement by Speaker</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={speakerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Engagement']}
                  labelFormatter={(label) => {
                    const speaker = speakerData.find(s => s.name === label);
                    return speaker ? speaker.fullName : label;
                  }}
                />
                <Bar dataKey="engagement" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Speaker Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
          Individual Speaker Metrics
        </h3>
        
        <div className="grid gap-4">
          {speakerData.length > 0 && speakerData.map((speaker) => (
            <div key={speaker.name} className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">{speaker.fullName}</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSentimentBg(speaker.sentiment)}`}>
                  {speaker.sentiment > 0.2 ? 'Positive' : 
                   speaker.sentiment < -0.2 ? 'Negative' : 'Neutral'}
                </span>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${getSentimentColor(speaker.sentiment)}`}>
                    {Math.round(speaker.sentiment)}
                  </div>
                  <p className="text-sm text-gray-600">Avg Sentiment</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {Math.round(speaker.engagement)}%
                  </div>
                  <p className="text-sm text-gray-600">Engagement</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {speaker.dominance}%
                  </div>
                  <p className="text-sm text-gray-600">Speaking Time</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SentimentView;