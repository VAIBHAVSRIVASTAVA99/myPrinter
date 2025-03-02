import { useState, useEffect } from 'react';
import { splitWordContentIntoPages } from '../utils/DocumentUtils';

const useWordProcessor = (selectedFile, wordContent, wordPages, currentWordPage) => {

  const isWordDocumentReady = () => {
    return selectedFile.isWord && wordContent;
  };
  
  const getCurrentWordContent = () => {
    if (!isWordDocumentReady()) return null;
    return wordPages.length > 0 ? wordPages[currentWordPage - 1] : wordContent;
  };

  return {
    isWordDocumentReady,
    getCurrentWordContent
  };
};

export default useWordProcessor;