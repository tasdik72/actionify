import React, { useState } from 'react';
import { ArrowLeft, Download, FileText, BarChart3, Users, Clock, MessageSquare, Hash } from 'lucide-react';
import TranscriptView from './results/TranscriptView';
import SummaryView from './results/SummaryView';
import ActionItemsView from './results/ActionItemsView';
import SentimentView from './results/SentimentView';
import ErrorBoundary from './ErrorBoundary';
import ExportModal from './results/ExportModal';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ResultsDashboardProps {
  results: {
    metadata?: {
      fileName?: string;
      processedAt?: string | number;
      duration?: number;
      participants?: number;
    };
    transcript?: {
      fullText?: string;
      segments?: any[];
      speakers?: any[];
    };
    actionItems?: any[];
    decisions?: any[];
    sentiment?: any;
    summary?: any;
  };
  onStartOver: () => void;
}

// Helper to safely get participant count
const getParticipantCount = (results: ResultsDashboardProps['results']) => {
  if (!results) return 0;
  // Try to get from metadata first
  if (results.metadata?.participants) return results.metadata.participants;
  // Then try from transcript speakers
  if (results.transcript?.speakers?.length) return results.transcript.speakers.length;
  // Then from sentiment speakers
  if (results.sentiment?.speakers) return Object.keys(results.sentiment.speakers).length;
  // Default to 1 if no info
  return 1;
};

// Helper to safely get duration
const getDuration = (results: ResultsDashboardProps['results']) => {
  if (!results) return 0;
  // Try to get from metadata first
  if (results.metadata?.duration) return results.metadata.duration;
  // Estimate from word count (150 words per minute)
  const wordCount = results.transcript?.fullText?.split(/\s+/).length || 0;
  return Math.ceil(wordCount / 2.5); // 150 words per minute = 2.5 words per second
};

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, onStartOver }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  const tabs: Tab[] = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'transcript', label: 'Transcript', icon: FileText },
    { id: 'actions', label: 'Action Items', icon: BarChart3 },
    { id: 'sentiment', label: 'Sentiment', icon: BarChart3 }
  ];

  const renderContent = () => {
    // Each tab gets its own error boundary to prevent one tab's error from breaking others
    const tabContent = (() => {
      switch (activeTab) {
        case 'transcript':
          return <TranscriptView data={results?.transcript || {}} />;
        case 'actions':
          return (
            <ActionItemsView 
              data={results?.actionItems || []} 
              decisions={results?.decisions || []} 
            />
          );
        case 'sentiment':
          return <SentimentView data={results?.sentiment || {}} />;
        case 'summary':
        default:
          return <SummaryView data={results?.summary} metadata={results?.metadata} />;
      }
    })();

    return (
      <ErrorBoundary 
        key={activeTab} // Reset error boundary when tab changes
        fallback={
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            An error occurred while loading this section. Please try switching tabs or refreshing the page.
          </div>
        }
      >
        {tabContent}
      </ErrorBoundary>
    );
  };

  const formatDuration = (seconds?: number): string => {
    if (typeof seconds !== 'number') return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const getWordCount = (text?: string): number => {
    return text ? text.trim().split(/\s+/).length : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onStartOver}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Start over"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Start Over</span>
              </button>
              <div className="h-6 w-px bg-gray-200" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Meeting Analysis</h1>
                <p className="text-sm text-gray-500">
                  {results?.metadata?.fileName || 'Untitled Meeting'} • 
                  Processed {new Date(results?.metadata?.processedAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export Results
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon={Clock} 
            label="Duration" 
            value={formatDuration(getDuration(results))} 
            iconBg="bg-blue-100" 
            iconColor="text-blue-600"
          />
          <StatCard 
            icon={Users} 
            label="Participants" 
            value={getParticipantCount(results) || 'N/A'}
            iconBg="bg-green-100" 
            iconColor="text-green-600"
          />
          <StatCard 
            icon={MessageSquare} 
            label="Word Count" 
            value={results?.transcript?.fullText ? getWordCount(results.transcript.fullText).toLocaleString() : 'N/A'}
            iconBg="bg-purple-100" 
            iconColor="text-purple-600"
          />
          <StatCard 
            icon={Hash} 
            label="Segments" 
            value={results?.transcript?.segments?.length?.toLocaleString() || 'N/A'}
            iconBg="bg-yellow-100" 
            iconColor="text-yellow-600"
          />
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            <ErrorBoundary 
              fallback={
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  An error occurred while loading this section. Please try refreshing the page.
                </div>
              }
            >
              {renderContent()}
            </ErrorBoundary>
          </div>
        </div>
      </div>
      {isExportModalOpen && (
        <ExportModal
          results={results}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}
    </div>
  );
};

// Helper component for stat cards
const StatCard: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  iconBg: string;
  iconColor: string;
}> = ({ icon: Icon, label, value, iconBg, iconColor }) => (
  <div className="bg-white rounded-xl shadow-sm p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className={`${iconBg} p-3 rounded-lg`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
  </div>
);

export default ResultsDashboard;