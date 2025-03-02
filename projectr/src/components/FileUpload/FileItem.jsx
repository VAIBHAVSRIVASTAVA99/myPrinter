import React from 'react';

const FileItem = ({ file, isSelected }) => {
  // Function to get the icon based on file type
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (fileType === 'application/pdf') {
      return (
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else if (fileType.includes('document') || fileType.includes('msword') || fileType.includes('officedocument')) {
      return (
        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  // Function to truncate file name if too long
  const truncateFileName = (name, maxLength = 15) => {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop();
    const baseName = name.substring(0, name.length - extension.length - 1);
    const truncatedBase = baseName.substring(0, maxLength - extension.length - 3);
    return `${truncatedBase}...${extension}`;
  };

  // Get file size in human-readable format
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="flex flex-col items-center justify-center w-28 h-28">
      {file.type.startsWith('image/') && file.preview ? (
        <div className="w-20 h-20 mb-2 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
          <img 
            src={file.preview} 
            alt={file.name} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-20 h-20 mb-2 rounded-md flex items-center justify-center bg-gray-100">
          {getFileIcon(file.type)}
        </div>
      )}
      <div className="text-xs text-center text-gray-800 font-medium">
        {truncateFileName(file.name)}
      </div>
      <div className="text-xs text-gray-500">
        {formatFileSize(file.size)}
      </div>
    </div>
  );
};

const FileUpload = ({ onChange, multiple }) => {
  return (
    <div className="w-full">
      <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <span className="mt-2 text-base text-gray-600">Drop files here or click to upload</span>
        <span className="mt-1 text-sm text-gray-500">Supported formats: PDF, DOC, DOCX, JPG, PNG</span>
        <input type="file" className="hidden" onChange={onChange} multiple={multiple} />
      </label>
    </div>
  );
};

// Add FileItem to FileUpload component to access it via FileUpload.FileItem
FileUpload.FileItem = FileItem;

export default FileUpload;
