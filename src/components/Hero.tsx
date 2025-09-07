import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, MessageSquare, CheckCircle, TrendingUp } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Meetings into
            <span className="text-black"> Actionable Insights</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Upload your meeting recordings and get intelligent summaries, action items, 
            decisions, and sentiment analysis in minutes. Stop losing track of what matters.
          </p>
          
          <div className="flex justify-center mb-16">
            <button onClick={() => navigate('/actionify')} className="bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-300">
              Start Analyzing Now
            </button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 mt-20">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Transcription</h3>
              <p className="text-gray-600 text-sm">
                Convert audio to text with 95%+ accuracy and speaker identification
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Action Items</h3>
              <p className="text-gray-600 text-sm">
                Automatically extract tasks, deadlines, and assignees from conversations
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Summary</h3>
              <p className="text-gray-600 text-sm">
                Get concise summaries highlighting key decisions and outcomes
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sentiment Analysis</h3>
              <p className="text-gray-600 text-sm">
                Understand meeting dynamics and team engagement patterns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;