import React from 'react';
import PDFPreview from './PDFPreview';
import WordPreview from './WordPreview';
import ExcelPreview from './ExcelPreview';
import PowerPointPreview from './PowerPoint';
import ImagePreview from './ImagePreview';

const Preview = ({ selectedFile, printSettings }) => {
  if (!selectedFile) {
    return (
      <div className="flex flex-col items-center justify-center h-140 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">No file selected for preview</p>
      </div>
    );
  }
  
  const fileType = selectedFile.type || '';
  const fileName = selectedFile.name || '';
  const fileExtension = fileName.split('.').pop().toLowerCase();
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'];
  const isImage = fileType.includes('image') || imageExtensions.includes(fileExtension);
    
  if (isImage) {
    return <ImagePreview file={selectedFile} printSettings={printSettings} />;
  } else if (fileType.includes('pdf') || fileExtension === 'pdf') {
    return <PDFPreview file={selectedFile} printSettings={printSettings} />;
  } else if (fileType.includes('word') || fileExtension === 'docx' || fileExtension === 'doc') {
    return <WordPreview file={selectedFile} printSettings={printSettings} />;
  } else if (fileType.includes('excel') || fileExtension === 'xlsx' || fileExtension === 'xls') {
    return <ExcelPreview file={selectedFile} printSettings={printSettings} />;
  } else if (fileType.includes('powerpoint') || fileExtension === 'pptx' || fileExtension === 'ppt') {
    return <PowerPointPreview file={selectedFile} printSettings={printSettings} />;
  } else {
    return <GenericFilePreview file={selectedFile} printSettings={printSettings} />;
  }
};

export default Preview;