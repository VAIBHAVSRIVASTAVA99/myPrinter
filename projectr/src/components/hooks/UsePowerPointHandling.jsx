import { useState, useEffect } from 'react';
import { splitPowerPointContentIntoSlides } from '../utils/DocumentUtils';

const usePowerPointProcessor = (selectedFile, pptContent, pptSlides, currentPptSlide) => {

  const isPowerPointDocumentReady = () => {
    return selectedFile.isPowerPoint && pptContent;
  };

  const getCurrentPptContent = () => {
    if (!isPowerPointDocumentReady()) return null;
    return pptSlides.length > 0 ? pptSlides[currentPptSlide - 1] : pptContent;
  };

  return {
    isPowerPointDocumentReady,
    getCurrentPptContent
  };
};

export default usePowerPointProcessor;