import React from 'react';
import FileItem from './FileItem';

const FileUpload = ({
  selectedFiles = [],
  currentPreviewIndex,
  handleFileChange,
  removeFile,
  selectFileForPreview,
  onFileChange // Added for compatibility with how it's used in App.js
}) => {
  // Use the appropriate handler based on what's provided
  const fileChangeHandler = onFileChange || handleFileChange;
  
  return (
    <div className="file-upload">
      <div className="mb-4">
        <label className="flex flex-col items-center px-4 py-6 bg-gray-50 text-blue-500 rounded-lg shadow-lg tracking-wide border border-blue-400 cursor-pointer hover:bg-blue-500 hover:text-white">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="mt-2 text-base">Add file</span>
          <input type="file" className="hidden" onChange={fileChangeHandler} multiple />
        </label>
      </div>
      
      {selectedFiles && selectedFiles.length > 0 && (
        <div className="file-list space-y-2 max-h-96 overflow-y-auto">
          {selectedFiles.map((file, index) => (
            <FileItem
              key={index}
              file={file}
              index={index}
              isActive={index === currentPreviewIndex}
              onSelect={() => selectFileForPreview && selectFileForPreview(index)}
              onRemove={() => removeFile && removeFile(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Add a simple FileItem subcomponent for use in App.js
FileUpload.FileItem = ({ file, isSelected }) => {
  // Determine file type icon based on file extension
  const getFileIcon = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    if (['doc', 'docx'].includes(extension)) {
      return (
        <svg className="w-10 h-10 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
          <path d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
        </svg>
      );
    } else if (['xls', 'xlsx'].includes(extension)) {
      return (
        <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
          <path d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
        </svg>
      );
    } else if (['pdf'].includes(extension)) {
      return (
        <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
          <path d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
        </svg>
      );
    } else {
      // Default file icon
      return (
        <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
          <path d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
        </svg>
      );
    }
  };

  return (
    <div className={`flex items-center p-2 ${isSelected ? 'bg-blue-50' : ''}`}>
      {getFileIcon(file)}
      <div className="ml-2 overflow-hidden">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
      </div>
    </div>
  );
};

export default FileUpload;