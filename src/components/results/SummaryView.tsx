import React from 'react';
import { Clock, Users, MessageSquare, TrendingUp } from 'lucide-react';

interface SummaryViewProps {
  data: any;
  metadata: any;
}

const SummaryView: React.FC<SummaryViewProps> = ({ data, metadata }) => {
  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
          Executive Summary
        </h3>
        <p className="text-gray-700 leading-relaxed text-lg">
          {data.executive}
        </p>
      </div>

      {/* Key Points */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Key Points Discussed
        </h3>
        <div className="space-y-3">
          {data.keyPoints.map((point: string, index: number) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-700 flex-1 leading-relaxed">{point}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topics Covered */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-purple-600" />
          Topics Covered
        </h3>
        <div className="flex flex-wrap gap-3">
          {data.topics.map((topic: string, index: number) => (
            <span
              key={index}
              className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 rounded-full text-sm font-medium border border-purple-200"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Meeting Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <div>
              <h4 className="font-semibold text-gray-900">Duration</h4>
              <p className="text-sm text-gray-600">Total meeting time</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {Math.floor(metadata.duration / 60)} minutes
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <Users className="w-8 h-8 text-green-600" />
            <div>
              <h4 className="font-semibold text-gray-900">Participants</h4>
              <p className="text-sm text-gray-600">Active speakers</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {metadata.participants}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <MessageSquare className="w-8 h-8 text-purple-600" />
            <div>
              <h4 className="font-semibold text-gray-900">Topics</h4>
              <p className="text-sm text-gray-600">Discussion areas</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {data.topics.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryView;