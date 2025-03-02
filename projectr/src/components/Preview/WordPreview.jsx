import React, { useState, useEffect, useRef, useCallback } from 'react';

const WordPreview = ({ file, printSettings }) => {
  const containerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mammothLoaded, setMammothLoaded] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [pageCount, setPageCount] = useState(1);
  const [content, setContent] = useState(null);
  const [previewKey, setPreviewKey] = useState(0);
  
  useEffect(() => {
    setPreviewKey(prevKey => prevKey + 1);
  }, [printSettings?.colorMode, printSettings?.orientation, printSettings?.paperSize]);
  
  const loadMammothJS = useCallback(() => {
    if (window.mammoth) {
      setMammothLoaded(true);
      return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
      console.log('Loading Mammoth.js...');
      
      const mammothScript = document.createElement('script');
      mammothScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
      mammothScript.async = true;
      
      mammothScript.onload = () => {
        console.log('Mammoth.js loaded successfully');
        setMammothLoaded(true);
        resolve();
      };
      
      mammothScript.onerror = () => {
        console.error('Failed to load Mammoth.js');
        setError('Failed to load Word processing library. Please check your internet connection and try again.');
        setLoading(false);
        reject(new Error('Failed to load Mammoth.js'));
      };
      
      document.body.appendChild(mammothScript);
    });
  }, []);

  useEffect(() => {
    loadMammothJS()
      .then(() => {
        if (file) {
          parseWordFile(file);
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Error loading library:', err);
      });
      
    return () => {
    };
  }, [loadMammothJS]);
  
  useEffect(() => {
    if (file && mammothLoaded) {
      parseWordFile(file);
    }
  }, [file, mammothLoaded]);

  useEffect(() => {
    if (containerRef.current) {
      const contentElement = containerRef.current.querySelector('.mammoth-content');
      if (contentElement) {
        contentElement.style.transform = `scale(${zoom / 100})`;
      }
    }
  }, [zoom]);

  const parseWordFile = async (file) => {
    if (!file) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    if (!window.mammoth) {
      try {
        await loadMammothJS();
      } catch (err) {
        setError('Failed to load Word processing library. Please refresh and try again.');
        setLoading(false);
        return;
      }
    }
    
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        
        window.mammoth.convertToHtml({ arrayBuffer })
          .then(result => {
            if (containerRef.current) {
              setContent(result.value);
              
              setPageCount(1);
              setLoading(false);
            }
          })
          .catch(err => {
            console.error('Error converting Word document:', err);
            setError('Failed to parse Word document. The file might be corrupted or in an unsupported format.');
            setLoading(false);
          });
      };
      
      reader.onerror = () => {
        setError('Failed to read Word file. Please try again with a different file.');
        setLoading(false);
      };
      
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error('Error handling Word file:', err);
      setError('Failed to process Word file. Please ensure it is a valid Word document.');
      setLoading(false);
    }
  };
  
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

  const getContentStyles = () => {
    const { colorMode } = printSettings || {};
    
    return {
      filter: colorMode === 'bw' ? 'grayscale(100%)' : 'none',
      transition: 'all 0.3s ease',
      fontFamily: "'Calibri', 'Arial', sans-serif",
      lineHeight: 1.5,
      padding: "20px",
      maxWidth: "800px",
      margin: "0 auto",
      transform: `scale(${zoom / 100})`,
      transformOrigin: "top center",
      transition: "transform 0.2s ease-in-out"
    };
  };

  const formatPaperSize = (size) => {
    if (!size) return 'A4';
    if (size.toLowerCase().startsWith('a')) {
      return size.toUpperCase();
    }
    return size.charAt(0).toUpperCase() + size.slice(1);
  };
  
  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full" style={getWrapperStyle()}>
        <div className="word-error flex flex-col items-center justify-center bg-red-50 border border-red-300 rounded-lg" style={getContainerStyle()}>
          <svg className="w-16 h-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-700 font-medium">Error loading Word document</p>
          <p className="text-red-500 text-sm">{error}</p>
          <button 
            onClick={() => { setError(null); setLoading(true); parseWordFile(file); }}
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">No Word document loaded</p>
          <p className="text-gray-400 text-sm mt-2">Upload a .docx file to preview its contents</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full" style={getWrapperStyle()}>
      <div className="word-preview border rounded-lg bg-white shadow-sm" style={getContainerStyle()} key={previewKey}>
        <div className="flex items-center justify-between bg-blue-100 p-3 border-b border-blue-200">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-blue-800 truncate max-w-xs">{file.name} ({Math.round(file.size / 1024)} KB)</span>
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
              className={`p-1 rounded hover:bg-blue-200 ${currentPage <= 1 || loading ? 'text-blue-400 cursor-not-allowed' : 'text-blue-700'}`}
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
                className="w-12 text-center border border-blue-300 rounded px-1 py-1 text-sm"
                aria-label="Page number"
              />
              <span className="mx-1 text-sm text-blue-600">of</span>
              <span className="text-sm font-medium text-blue-700">{pageCount || 1}</span>
            </div>
            
            <button 
              onClick={goToNextPage}
              disabled={currentPage >= pageCount || loading}
              className={`p-1 rounded hover:bg-blue-200 ${currentPage >= pageCount || loading ? 'text-blue-400 cursor-not-allowed' : 'text-blue-700'}`}
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
              className={`p-1 rounded hover:bg-blue-200 ${zoom <= 50 ? 'text-blue-400 cursor-not-allowed' : 'text-blue-700'}`}
              title="Zoom Out"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <span className="mx-2 text-sm text-blue-700">{zoom}%</span>
            
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className={`p-1 rounded hover:bg-blue-200 ${zoom >= 200 ? 'text-blue-400 cursor-not-allowed' : 'text-blue-700'}`}
              title="Zoom In"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            
            <button
              onClick={handleZoomReset}
              className="ml-1 text-xs text-blue-700 hover:text-blue-800 hover:underline"
              title="Reset Zoom"
            >
              Reset
            </button>
          </div>
        </div>
        
        <div className="word-container overflow-auto flex-1 p-4 bg-white" style={{ overflowY: "auto", overflowX: "auto" }}>
          <div 
            ref={containerRef} 
            className="word-content w-full h-full flex justify-center"
          >
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-3 text-blue-600">Loading document...</span>
              </div>
            ) : (
              <div 
                className="mammoth-content" 
                style={getContentStyles()}
                dangerouslySetInnerHTML={{ __html: content || '' }}
              />
            )}
          </div>
        </div>
        
        <div className="p-2 text-xs text-gray-500 border-t flex justify-between items-center bg-gray-50">
          <p>Note: This is a preview. Some Word formatting may appear differently.</p>
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

export default WordPreview;