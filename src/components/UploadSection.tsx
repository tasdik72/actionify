import React, { useState, useCallback } from 'react';
import { Upload, FileAudio, FileVideo, FileText, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface UploadSectionProps {
  onFileUploaded: (data: any) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFileUploaded }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileSelection = (file: File) => {
    // Validate file type
    const allowedTypes = [
      'audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/flac',
      'video/mp4', 'video/mov', 'video/avi', 'video/webm'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload an audio or video file');
      return;
    }
    
    // Validate file size (2GB limit)
    if (file.size > 2 * 1024 * 1024 * 1024) {
      toast.error('File size must be less than 2GB');
      return;
    }
    
    setSelectedFile(file);
    toast.success('File selected successfully');
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleSubmit = async () => {
    if (uploadMode === 'file' && !selectedFile) {
      toast.error('Please select a file first');
      return;
    }
    
    if (uploadMode === 'text' && !textInput.trim()) {
      toast.error('Please enter a transcript');
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload and processing
    setTimeout(() => {
      const data = {
        type: uploadMode,
        file: selectedFile,
        text: textInput,
        fileId: 'file-' + Date.now(),
        fileName: selectedFile?.name || 'Text Input',
        fileSize: selectedFile?.size || textInput.length,
        uploadedAt: new Date().toISOString()
      };
      
      onFileUploaded(data);
      toast.success('Upload successful! Starting analysis...');
    }, 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('audio/')) return <FileAudio className="w-8 h-8" />;
    if (file.type.startsWith('video/')) return <FileVideo className="w-8 h-8" />;
    return <FileText className="w-8 h-8" />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Your Meeting Content
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose to upload an audio/video file or paste a transcript directly. 
          Our intelligent system will analyze everything and extract actionable insights.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        {/* Upload Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setUploadMode('file')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                uploadMode === 'file'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setUploadMode('text')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                uploadMode === 'text'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Paste Transcript
            </button>
          </div>
        </div>

        {uploadMode === 'file' ? (
          <div>
            {/* File Upload Zone */}
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drag and drop your file here
              </h3>
              <p className="text-gray-600 mb-6">
                or click to browse from your computer
              </p>
              
              <input
                type="file"
                onChange={handleFileInput}
                accept="audio/*,video/*"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 cursor-pointer"
              >
                Choose File
              </label>
              
              <div className="mt-6 text-sm text-gray-500">
                <p>Supports: MP3, WAV, M4A, FLAC, MP4, MOV, AVI, WEBM</p>
                <p>Maximum file size: 2GB</p>
              </div>
            </div>

            {/* Selected File Display */}
            {selectedFile && (
              <div className="mt-6 bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-600">
                      {getFileIcon(selectedFile)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {selectedFile.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Text Input */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-900">
                Meeting Transcript
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste your meeting transcript here. Include speaker names if available for better analysis..."
                className="w-full h-64 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                maxLength={50000}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Maximum 50,000 characters</span>
                <span>{textInput.length}/50,000</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={isUploading || (uploadMode === 'file' && !selectedFile) || (uploadMode === 'text' && !textInput.trim())}
            className="px-12 py-4 bg-black text-white font-semibold text-lg rounded-xl hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Processing...' : 'Start Analysis'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;