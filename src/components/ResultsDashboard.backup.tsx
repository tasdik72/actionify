import React, { useState } from 'react';
import { ArrowLeft, Download, FileText, BarChart3, Users, Clock, MessageSquare, Hash } from 'lucide-react';
import TranscriptView from './results/TranscriptView';
import SummaryView from './results/SummaryView';
import ActionItemsView from './results/ActionItemsView';
import SentimentView from './results/SentimentView';
import ErrorBoundary from './ErrorBoundary';

interface ResultsDashboardProps {
  results: any;
  onStartOver: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, onStartOver }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [showExportModal] = useState(false);

  const tabs = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'transcript', label: 'Transcript', icon: FileText },
    { id: 'actions', label: 'Action Items', icon: BarChart3 },
    { id: 'sentiment', label: 'Sentiment', icon: BarChart3 }
  ];

  const renderContent = () => {
    const tabContent = (() => {
      try {
        switch (activeTab) {
          case 'transcript':
            return <TranscriptView data={results?.transcript || {}} />;
          case 'actions':
            return <ActionItemsView 
              data={results?.actionItems || []} 
              decisions={results?.decisions || []} 
            />;
          case 'sentiment':
            return <SentimentView data={results?.sentiment || {}} />;
          default:
            return <SummaryView 
              data={results?.summary || {}} 
              metadata={results?.metadata || {}} 
            />;
        }
      } catch (error) {
        console.error('Error rendering tab content:', error);
        return (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error loading this section. Please try refreshing the page or contact support if the issue persists.
                </p>
              </div>
            </div>
          </div>
        );
      }
    })();

    return <ErrorBoundary fallback={<div className="p-4 bg-red-50 text-red-700 rounded-lg">An error occurred in this section.</div>}>
      {tabContent}
    </ErrorBoundary>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onStartOver}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Start Over</span>
              </button>
              <div className="h-6 border-l border-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Meeting Analysis Complete
                </h1>
                <p className="text-gray-600">
                  {results?.metadata?.fileName || 'Meeting'} • Processed {new Date(results?.metadata?.processedAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => {}}
                className="flex items-center space-x-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-2xl font-bold text-gray-900">
                  {results?.metadata?.duration 
                    ? `${Math.floor(results.metadata.duration / 60)}m ${results.metadata.duration % 60}s` 
                    : 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="text-2xl font-bold text-gray-900">
                  {results?.metadata?.participants || results?.transcript?.speakers?.length || 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Word Count</p>
                <p className="text-2xl font-bold text-gray-900">
                  {results?.transcript?.fullText ? results.transcript.fullText.split(/\s+/).length : 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Hash className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Segments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {results?.transcript?.segments?.length || 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-2xl font-bold text-gray-900">
                  {results?.metadata?.duration 
                    ? `${Math.floor(results.metadata.duration / 60)}m ${results.metadata.duration % 60}s` 
                    : 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="text-2xl font-bold text-gray-900">
                  {results?.metadata?.participants || results?.transcript?.speakers?.length || 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Word Count</p>
                <p className="text-2xl font-bold text-gray-900">
                  {results?.transcript?.fullText ? results.transcript.fullText.split(/\s+/).length : 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Hash className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Segments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {results?.transcript?.segments?.length || 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Action Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {results.actionItems.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sentiment</p>
                <p className="text-2xl font-bold text-green-600 capitalize">
                  {results.sentiment.overall.sentiment}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  </div>
);

export default ResultsDashboard;