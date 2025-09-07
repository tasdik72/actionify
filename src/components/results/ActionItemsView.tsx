import React, { useState } from 'react';
import { CheckSquare, Clock, User, AlertTriangle, CheckCircle } from 'lucide-react';

interface ActionItemsViewProps {
  data: any[];
  decisions: any[];
}

const ActionItemsView: React.FC<ActionItemsViewProps> = ({ data, decisions }) => {
  const [filter, setFilter] = useState('all');

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <CheckSquare className="w-4 h-4 text-green-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  const filteredActions = data.filter(item => {
    if (filter === 'all') return true;
    return item.priority === filter;
  });

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return 'No deadline set';
    try {
      return new Date(deadline).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return deadline;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'urgent', 'high', 'medium', 'low'].map((priority) => (
          <button
            key={priority}
            onClick={() => setFilter(priority)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === priority
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
            {priority !== 'all' && (
              <span className="ml-2 text-xs">
                ({data.filter(item => item.priority === priority).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Action Items */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckSquare className="w-5 h-5 mr-2 text-blue-600" />
          Action Items ({filteredActions.length})
        </h3>
        
        <div className="space-y-4">
          {filteredActions.map((item, index) => (
            <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getPriorityIcon(item.priority)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{item.task}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.context}</p>
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                  {item.priority.toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{item.assignee || 'Unassigned'}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatDeadline(item.deadline)}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    item.confidence >= 0.9 ? 'bg-green-500' :
                    item.confidence >= 0.8 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <span className="text-xs">
                    {Math.round(item.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {filteredActions.length === 0 && (
            <div className="text-center py-12">
              <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No action items found for the selected filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Decisions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
          Key Decisions ({decisions.length})
        </h3>
        
        <div className="space-y-4">
          {decisions.map((decision, index) => (
            <div key={decision.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{decision.decision}</h4>
                  <p className="text-sm text-gray-600 mb-2">{decision.context}</p>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    decision.confidence === 'high' ? 'bg-green-50 border-green-200 text-green-800' :
                    decision.confidence === 'medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                    'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {decision.confidence.toUpperCase()} CONFIDENCE
                  </span>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    decision.category === 'strategic' ? 'bg-purple-50 border-purple-200 text-purple-800' :
                    decision.category === 'tactical' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                    decision.category === 'procedural' ? 'bg-gray-50 border-gray-200 text-gray-800' :
                    'bg-orange-50 border-orange-200 text-orange-800'
                  }`}>
                    {decision.category.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Participants:</span>
                <div className="flex flex-wrap gap-1">
                  {decision.participants.map((participant: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {participant}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActionItemsView;