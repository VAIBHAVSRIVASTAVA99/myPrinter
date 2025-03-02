import { useState, useEffect } from 'react';

const useExcelProcessor = (selectedFile, excelContent, excelSheets, currentExcelSheet, sheetContents) => {
 
  const isExcelDocumentReady = () => {
    return selectedFile.isExcel && excelContent;
  };
  
  const getCurrentSheetContent = () => {
    if (!isExcelDocumentReady()) return null;
    
    return excelSheets.length > 0 ? 
      sheetContents[excelSheets[currentExcelSheet]] : 
      excelContent;
  };

  return {
    isExcelDocumentReady,
    getCurrentSheetContent
  };
};

export default useExcelProcessor;