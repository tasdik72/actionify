import React, { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet, File, Code } from 'lucide-react';
import toast from 'react-hot-toast';
import { exportToText, downloadTextFile, exportToJSON, downloadJSONFile, exportToMarkdown, downloadMarkdownFile, exportToPDF, downloadPDF } from '../../services/exportService';

interface ExportModalProps {
  results: any;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ results, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedSections, setSelectedSections] = useState(['summary', 'actionItems', 'decisions']);
  const [isExporting, setIsExporting] = useState(false);

  const formats = [
    { 
      id: 'pdf', 
      name: 'PDF Report', 
      icon: FileSpreadsheet, 
      description: 'Professional formatted meeting report',
      color: 'text-black'
    },
    { 
      id: 'md', 
      name: 'Markdown (.md)', 
      icon: FileText, 
      description: 'Readable Markdown report',
      color: 'text-black'
    },
    { 
      id: 'txt', 
      name: 'Plain Text (.txt)', 
      icon: File, 
      description: 'Simple text report',
      color: 'text-black'
    },
    { 
      id: 'json', 
      name: 'JSON Data', 
      icon: Code, 
      description: 'Raw data for API integration and custom processing',
      color: 'text-black'
    }
  ];

  const sections = [
    { id: 'summary', name: 'Summary', description: 'Executive summary and key points' },
    { id: 'transcript', name: 'Full Transcript', description: 'Complete conversation with timestamps' },
    { id: 'actionItems', name: 'Action Items', description: 'Tasks, deadlines, and assignments' },
    { id: 'decisions', name: 'Decisions', description: 'Key decisions and outcomes' },
    { id: 'sentiment', name: 'Sentiment Analysis', description: 'Meeting dynamics and engagement data' }
  ];

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const baseName = `meeting-analysis-${results.metadata?.fileId ?? 'unknown'}`;
      if (selectedFormat === 'pdf') {
        const doc = exportToPDF(results, selectedSections);
        downloadPDF(doc, `${baseName}.pdf`);
      } else if (selectedFormat === 'md') {
        const md = exportToMarkdown(results, selectedSections);
        downloadMarkdownFile(md, `${baseName}.md`);
      } else if (selectedFormat === 'txt') {
        const txt = exportToText(results, selectedSections);
        downloadTextFile(txt, `${baseName}.txt`);
      } else if (selectedFormat === 'json') {
        const json = exportToJSON(results, selectedSections);
        downloadJSONFile(json, `${baseName}.json`);
      }
      toast.success('Export complete!');
      onClose();
    } catch (error) {
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Export Meeting Analysis</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Export Format</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {formats.map((format) => {
                const Icon = format.icon;
                return (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedFormat === format.id
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={`w-6 h-6 mt-1 ${format.color}`} />
                      <div>
                        <h4 className="font-semibold text-gray-900">{format.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{format.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Sections to Include</h3>
            <div className="space-y-3">
              {sections.map((section) => (
                <label
                  key={section.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(section.id)}
                    onChange={() => handleSectionToggle(section.id)}
                    className="w-5 h-5 text-black border-gray-300 rounded focus:ring-gray-800 mt-0.5"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{section.name}</div>
                    <div className="text-sm text-gray-600">{section.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Export Preview */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-2">Export Preview</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Format:</span> {formats.find(f => f.id === selectedFormat)?.name}</p>
              <p><span className="font-medium">Sections:</span> {selectedSections.length} of {sections.length} selected</p>
              <p><span className="font-medium">File name:</span> meeting-analysis-{results.metadata.fileId}.{selectedFormat}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleExport}
            disabled={isExporting || selectedSections.length === 0}
            className="flex items-center space-x-2 px-8 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : 'Export Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;