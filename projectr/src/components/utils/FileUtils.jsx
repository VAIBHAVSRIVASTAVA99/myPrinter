// Function to check file type
export const getFileType = (fileName) => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.endsWith('.pdf')) {
      return { isPdf: true, isWord: false, isExcel: false, isPpt: false, fileType: 'pdf' };
    } else if (lowerName.endsWith('.doc') || lowerName.endsWith('.docx')) {
      return { isPdf: false, isWord: true, isExcel: false, isPpt: false, fileType: 'word' };
    } else if (lowerName.endsWith('.xls') || lowerName.endsWith('.xlsx') || lowerName.endsWith('.csv')) {
      return { isPdf: false, isWord: false, isExcel: true, isPpt: false, fileType: 'excel' };
    } else if (lowerName.endsWith('.ppt') || lowerName.endsWith('.pptx')) {
      return { isPdf: false, isWord: false, isExcel: false, isPpt: true, fileType: 'powerpoint' };
    } else {
      return { isPdf: false, isWord: false, isExcel: false, isPpt: false, fileType: 'image' };
    }
  };
  
  // Function to generate PDF thumbnails
  export const generatePdfThumbnail = async (file, fileIndex, setPdfThumbnails) => {
    if (!window.pdfjsLib) return;
    
    try {
      const fileReader = new FileReader();
      
      fileReader.onload = async function() {
        try {
          // Load the PDF document
          const typedArray = new Uint8Array(this.result);
          const loadingTask = window.pdfjsLib.getDocument(typedArray);
          
          const pdfDoc = await loadingTask.promise;
          
          // Always render the first page as thumbnail
          const page = await pdfDoc.getPage(1);
          const viewport = page.getViewport({ scale: 1.0 });
          
          // Create a new canvas for the thumbnail
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          // Scale down for thumbnail
          const scale = 100 / viewport.width; // Thumbnail width of 100px
          const scaledViewport = page.getViewport({ scale });
          
          canvas.height = scaledViewport.height;
          canvas.width = scaledViewport.width;
          
          // Render PDF page to canvas
          const renderContext = {
            canvasContext: context,
            viewport: scaledViewport
          };
          
          await page.render(renderContext).promise;
          
          // Convert canvas to data URL
          const thumbnailUrl = canvas.toDataURL('image/png');
          
          // Update thumbnails state
          setPdfThumbnails(prev => ({
            ...prev,
            [fileIndex]: thumbnailUrl
          }));
        } catch (error) {
          console.error('Error generating PDF thumbnail:', error);
        }
      };
      
      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error generating PDF thumbnail:', error);
    }
  };
  
  // Get file icon based on file type
  export const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return (
          <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'word':
        return (
          <svg className="w-8 h-8 mx-auto text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'excel':
        return (
          <svg className="w-8 h-8 mx-auto text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'powerpoint':
        return (
          <svg className="w-8 h-8 mx-auto text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
          </svg>
        );
    }
  };
  
  // Apply image filters for non-PDF files
  export const getFilterStyle = (colorMode, printQuality, selectedFile) => {
    let filters = [];
    
    if (colorMode === "bw" && !selectedFile.isPdf) {
      filters.push("grayscale(100%)");
    }
    
    // Add quality-related filters for non-PDFs
    if (printQuality === "draft" && !selectedFile.isPdf) {
      filters.push("contrast(90%)");
      filters.push("brightness(105%)");
    } else if (printQuality === "high" && !selectedFile.isPdf) {
      filters.push("contrast(110%)");
      filters.push("saturate(105%)");
    }
    
    return filters.length > 0 ? { filter: filters.join(' ') } : {};
  };
  
  // Apply rotation based on orientation
  export const getRotationStyle = (orientation, selectedFile) => {
    if (!selectedFile.isPdf) {
      // For images, we can directly rotate
      const isLandscape = orientation === "landscape";
      const img = new Image();
      
      if (selectedFile.preview) {
        img.src = selectedFile.preview;
        // Check if image orientation needs changing
        const needsRotation = (isLandscape && img.width < img.height) || 
                             (!isLandscape && img.width > img.height);
        
        if (needsRotation) {
          return { transform: 'rotate(90deg)' };
        }
      }
    }
    
    return {};
  };
  
  // Apply paper size styles
  export const getPaperSizeStyle = (paperSize, selectedFile) => {
    if (!selectedFile.isPdf) {
      switch (paperSize) {
        case "letter":
          return { maxWidth: '215.9mm', maxHeight: '279.4mm' };
        case "a3":
          return { maxWidth: '297mm', maxHeight: '420mm' };
        case "a4":
          return { maxWidth: '210mm', maxHeight: '297mm' };
        default:
          return {};
      }
    }
    return {};
  };
  
  // Get margin styles
  export const getMarginStyle = (margins, selectedFile) => {
    if (!selectedFile.isPdf) {
      switch (margins) {
        case "narrow":
          return { padding: '10px' };
        case "normal":
          return { padding: '25px' };
        case "wide":
          return { padding: '40px' };
        default:
          return {};
      }
    }
    return {};
  };
  
  // Get border styles
  export const getBorderStyle = (borderSize, selectedFile) => {
    if (!selectedFile.isPdf && borderSize !== "none") {
      switch (borderSize) {
        case "thin":
          return { border: '1px solid black' };
        case "medium":
          return { border: '3px solid black' };
        case "thick":
          return { border: '5px solid black' };
        default:
          return {};
      }
    }
    return {};
  };