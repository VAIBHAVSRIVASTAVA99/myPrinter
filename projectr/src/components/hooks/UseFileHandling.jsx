import { useState, useEffect } from 'react';

const useFileHandling = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (selectedFiles.length > 0 && currentPreviewIndex >= 0 && currentPreviewIndex < selectedFiles.length) {
      setSelectedFile(selectedFiles[currentPreviewIndex]);
    } else {
      setSelectedFile(null);
    }
  }, [selectedFiles, currentPreviewIndex]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    
    if (selectedFiles.length === 0) {
      setCurrentPreviewIndex(0);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      
      if (index === currentPreviewIndex) {
        setCurrentPreviewIndex(index > 0 ? index - 1 : 0);
      } else if (index < currentPreviewIndex) {
        setCurrentPreviewIndex(currentPreviewIndex - 1);
      }
      
      return newFiles;
    });
  };

  const selectFileForPreview = (index) => {
    if (index >= 0 && index < selectedFiles.length) {
      setCurrentPreviewIndex(index);
    }
  };

  return {
    selectedFile,
    selectedFiles,
    currentPreviewIndex,
    handleFileChange,
    removeFile,
    selectFileForPreview
  };
};

export default useFileHandling;