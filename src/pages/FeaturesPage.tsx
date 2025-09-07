import React from 'react';
import { Brain, CheckCircle, MessageSquare, TrendingUp, Clock, Users, Shield, Zap } from 'lucide-react';

const FeaturesPage: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Smart Transcription',
      description: 'Convert audio to text with 95%+ accuracy and automatic speaker identification',
      details: [
        'Real-time audio processing',
        'Speaker diarization',
        'Noise reduction',
        'Multiple language support'
      ]
    },
    {
      icon: CheckCircle,
      title: 'Action Item Extraction',
      description: 'Automatically identify tasks, deadlines, and assignees from conversations',
      details: [
        'Smart task detection',
        'Deadline recognition',
        'Assignee identification',
        'Priority classification'
      ]
    },
    {
      icon: MessageSquare,
      title: 'Intelligent Summaries',
      description: 'Get concise summaries highlighting key decisions and outcomes',
      details: [
        'Executive summaries',
        'Key point extraction',
        'Decision tracking',
        'Topic categorization'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Sentiment Analysis',
      description: 'Understand meeting dynamics and team engagement patterns',
      details: [
        'Emotion detection',
        'Engagement metrics',
        'Speaker analysis',
        'Timeline visualization'
      ]
    },
    {
      icon: Clock,
      title: 'Time Tracking',
      description: 'Monitor speaking time and participation across team members',
      details: [
        'Speaking time analysis',
        'Participation metrics',
        'Meeting efficiency',
        'Balance insights'
      ]
    },
    {
      icon: Users,
      title: 'Team Analytics',
      description: 'Track team collaboration patterns and meeting effectiveness',
      details: [
        'Collaboration metrics',
        'Team dynamics',
        'Meeting frequency',
        'Productivity insights'
      ]
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'Enterprise-grade security with end-to-end encryption',
      details: [
        'Data encryption',
        'Secure storage',
        'Access controls',
        'Compliance ready'
      ]
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Get results in minutes, not hours with our optimized processing',
      details: [
        'Fast processing',
        'Live updates',
        'Instant notifications',
        'Efficient algorithms'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="text-black"> Meeting Intelligence</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to transform your meetings into actionable insights and drive better outcomes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-black rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Meetings?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start analyzing your meetings today and unlock the power of intelligent insights.
          </p>
          <button className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300">
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;