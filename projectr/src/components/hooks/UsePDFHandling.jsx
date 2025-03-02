import { useState, useEffect, useRef } from 'react';

const usePDFProcessor = (selectedFile) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState(false);
  
  const canvasRef = useRef(null);
  const pdfDocRef = useRef(null);

  useEffect(() => {
    if (selectedFile && selectedFile.isPdf && selectedFile.file && window.pdfjsLib) {
      renderPdf(selectedFile.file);
    }
  }, [selectedFile, pageNumber]);

  const renderPdf = async (file) => {
    try {
      const fileReader = new FileReader();
      
      fileReader.onload = async function() {
        try {
          const typedArray = new Uint8Array(this.result);
          const loadingTask = window.pdfjsLib.getDocument(typedArray);
          
          const pdfDoc = await loadingTask.promise;
          pdfDocRef.current = pdfDoc;
          setNumPages(pdfDoc.numPages);
          
          const page = await pdfDoc.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1.0 });
          
          const canvas = canvasRef.current;
          if (!canvas) return;
          
          const context = canvas.getContext('2d');
          
          const maxWidth = 600;
          const maxHeight = 500;
          
          const scaleWidth = maxWidth / viewport.width;
          const scaleHeight = maxHeight / viewport.height;
          
          const scale = Math.min(scaleWidth, scaleHeight);
          
          const scaledViewport = page.getViewport({ scale: scale });
          
          canvas.height = scaledViewport.height;
          canvas.width = scaledViewport.width;
          
          context.fillStyle = 'white';
          context.fillRect(0, 0, canvas.width, canvas.height);
          
          const renderContext = {
            canvasContext: context,
            viewport: scaledViewport
          };
          
          await page.render(renderContext).promise;
          
          setPdfError(false);
        } catch (error) {
          console.error('Error rendering PDF:', error);
          setPdfError(true);
        }
      };
      
      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error loading PDF:', error);
      setPdfError(true);
    }
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  return {
    numPages,
    pageNumber,
    pdfError,
    canvasRef,
    pdfDocRef,
    goToPrevPage,
    goToNextPage,
    renderPdf
  };
};

export default usePDFProcessor;