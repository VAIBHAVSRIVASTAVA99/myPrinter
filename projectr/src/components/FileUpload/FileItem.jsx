// src/components/FileUpload/FileItem.js
import React, { useState, useEffect } from 'react';

const FileItem = ({ file, isSelected }) => {
  const [thumbnail, setThumbnail] = useState(null);
  
  useEffect(() => {
    // Create thumbnails for image files
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnail(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  // Determine file type for icon selection
  const getFileIcon = () => {
    if (file.type.startsWith('image/')) {
      return thumbnail ? (
        <img 
          src={thumbnail}
          alt={file.name}
          className="w-full h-full object-cover rounded-sm"
        />
      ) : (
        <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 9a1 1 0 100-2 1 1 0 000 2z" fill="currentColor"/>
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      return (
        <svg className="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 3v4a1 1 0 001 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 9v8m3-8v8m3-8v8" stroke="currentColor" strokeLinecap="round"/>
        </svg>
      );
    } else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      return (
        <svg className="w-10 h-10 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 3v4a1 1 0 001 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 12l2 5 2-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else if (file.type.includes('powerpoint') || file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
      return (
        <svg className="w-10 h-10 text-orange-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 3v4a1 1 0 001 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2"/>
          <path d="M9.5 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" stroke="currentColor" strokeWidth="2"/>
          <path d="M9.5 12v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    } else {
      // Default file icon
      return (
        <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 3v4a1 1 0 001 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    }
  };

  return (
    <div className={`flex flex-col items-center w-20 h-24 ${isSelected ? 'opacity-100' : 'opacity-80'}`}>
      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
        {getFileIcon()}
      </div>
      <div className="mt-1 w-full text-center">
        <p className="text-xs text-gray-600 truncate" title={file.name}>
          {file.name.length > 12 ? file.name.substring(0, 10) + '...' : file.name}
        </p>
      </div>
    </div>
  );
};

export default FileItem;