import React, { useState, useEffect, useRef } from 'react';

const PDFPreview = ({ file, printSettings }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [zoom, setZoom] = useState(100);
  const pdfContainerRef = useRef(null);

  useEffect(() => {
    setPreviewKey(prevKey => prevKey + 1);
  }, [printSettings?.colorMode, printSettings?.orientation, printSettings?.paperSize]);

  useEffect(() => {
    if (file) {
      try {
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
        setLoading(false);
        return () => URL.revokeObjectURL(fileUrl);
      } catch (err) {
        setError('Failed to create preview for PDF file.');
        setLoading(false);
      }
    } else {
      setPreviewUrl('');
      setLoading(false);
    }
  }, [file]);

  useEffect(() => {
    if (pdfContainerRef.current) {
      const pdfElement = pdfContainerRef.current.querySelector('iframe');
      if (pdfElement) {
        pdfElement.style.transform = `scale(${zoom / 100})`;
      }
    }
  }, [zoom]);

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePageChange = (e) => {
    const pageNumber = parseInt(e.target.value, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= pageCount) {
      setCurrentPage(pageNumber);
    }
  };

  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 20, 200));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 20, 50));
  };

  const handleZoomReset = () => {
    setZoom(100);
  };

  const getWrapperStyle = () => {
    return {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%"
    };
  };

  const getContainerStyle = () => {
    const { orientation, paperSize } = printSettings || {};
    
    const style = {
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
    };
    
    if (orientation === 'landscape') {
      style.height = "70vh";
      style.width = "95%";
      style.maxWidth = "1400px";
    } else {
      style.height = "90vh";
      style.width = "75%";
      style.maxWidth = "900px";
    }
    
    return style;
  };

  const getPDFStyles = () => {
    const { colorMode } = printSettings || {};
    
    return {
      width: "100%",
      height: "100%",
      border: "none",               
      filter: colorMode === 'bw' ? 'grayscale(100%)' : 'none',
      transition: 'all 0.3s ease',
      transformOrigin: "top center",
      transform: `scale(${zoom / 100})`,
      backgroundColor: "white",     
      boxShadow: "none",           
      display: "block",            
      margin: 0,                   
      padding: 0                   
    };
  };

  const getPDFWrapperStyles = () => {
    return {
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",   
      overflow: "hidden",         
      border: "none",             
      borderRadius: 0,            
      padding: 0                  
    };
  };

  const formatPaperSize = (size) => {
    if (!size) return 'A4';
    if (size.toLowerCase().startsWith('a')) {
      return size.toUpperCase();
    }
    return size.charAt(0).toUpperCase() + size.slice(1);
  };


  const handlePDFLoad = () => {
    setLoading(false);
    
   
    // from the PDF.js library or another PDF parsing library
    setPageCount(1);
  };


  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full" style={getWrapperStyle()}>
        <div className="pdf-error flex flex-col items-center justify-center bg-red-50 border border-red-300 rounded-lg" style={getContainerStyle()}>
          <svg className="w-16 h-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-700 font-medium">Error loading PDF document</p>
          <p className="text-red-500 text-sm">{error}</p>
          <button 
            onClick={() => { setError(null); setLoading(true); }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!file) {
    return (
      <div className="flex items-center justify-center w-full h-full" style={getWrapperStyle()}>
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg" style={getContainerStyle()}>
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500">No PDF document loaded</p>
          <p className="text-gray-400 text-sm mt-2">Upload a .pdf file to preview its contents</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full" style={getWrapperStyle()}>
      <div className="pdf-preview border rounded-lg bg-white shadow-sm" style={getContainerStyle()} key={previewKey}>
        <div className="flex items-center justify-between bg-red-100 p-3 border-b border-red-200">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-red-800 truncate max-w-xs">{file.name} ({Math.round(file.size / 1024)} KB)</span>
          </div>
          
          <div className="text-xs flex items-center space-x-2">
            <span>{printSettings?.colorMode === 'bw' ? 'B&W' : 'Color'}</span>
            <span>•</span>
            <span>{printSettings?.orientation === 'landscape' ? 'Landscape' : 'Portrait'}</span>
            <span>•</span>
            <span>{formatPaperSize(printSettings?.paperSize)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <button 
              onClick={goToPrevPage}
              disabled={currentPage <= 1 || loading}
              className={`p-1 rounded hover:bg-red-200 ${currentPage <= 1 || loading ? 'text-red-400 cursor-not-allowed' : 'text-red-700'}`}
              title="Previous Page"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex items-center mx-2">
              <input
                type="number"
                min="1"
                max={pageCount || 1}
                value={currentPage}
                onChange={handlePageChange}
                disabled={loading}
                className="w-12 text-center border border-red-300 rounded px-1 py-1 text-sm"
                aria-label="Page number"
              />
              <span className="mx-1 text-sm text-red-600">of</span>
              <span className="text-sm font-medium text-red-700">{pageCount || 1}</span>
            </div>
            
            <button 
              onClick={goToNextPage}
              disabled={currentPage >= pageCount || loading}
              className={`p-1 rounded hover:bg-red-200 ${currentPage >= pageCount || loading ? 'text-red-400 cursor-not-allowed' : 'text-red-700'}`}
              title="Next Page"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className={`p-1 rounded hover:bg-red-200 ${zoom <= 50 ? 'text-red-400 cursor-not-allowed' : 'text-red-700'}`}
              title="Zoom Out"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <span className="mx-2 text-sm text-red-700">{zoom}%</span>
            
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className={`p-1 rounded hover:bg-red-200 ${zoom >= 200 ? 'text-red-400 cursor-not-allowed' : 'text-red-700'}`}
              title="Zoom In"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            
            <button
              onClick={handleZoomReset}
              className="ml-1 text-xs text-red-700 hover:text-red-800 hover:underline"
              title="Reset Zoom"
            >
              Reset
            </button>
          </div>
        </div>
        
        <div 
          ref={pdfContainerRef}
          className="pdf-container overflow-auto flex-1 bg-white" 
          style={{ overflowY: "auto", overflowX: "auto", padding: 0 }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <svg className="animate-spin h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-3 text-red-600">Loading document...</span>
            </div>
          ) : (
            <div style={getPDFWrapperStyles()}>
              <iframe
                src={`${previewUrl}#page=${currentPage}&view=FitH,top&toolbar=0&navpanes=0&statusbar=0`}
                style={getPDFStyles()}
                title="PDF Preview"
                onLoad={handlePDFLoad}
                frameBorder="0"
              />
            </div>
          )}
        </div>
        
        <div className="p-2 text-xs text-gray-500 border-t flex justify-between items-center bg-gray-50">
          <p>Note: This is a preview. Some PDF features may appear differently when printed.</p>
          <div className="flex items-center">
            {file.lastModified && (
              <span className="mr-4">Modified: {new Date(file.lastModified).toLocaleDateString()}</span>
            )}
            <span>Page {currentPage} of {pageCount || 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;