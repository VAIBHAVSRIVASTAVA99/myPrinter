// Function to split Word document content into pages
export const splitWordContentIntoPages = (content) => {
    // For simplicity, we'll split by page break markers or when we reach a certain element count
    // More sophisticated methods could involve tracking height or using actual page break info
    
    // First, parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Look for page break markers (could be comments, specific divs, or certain styles)
    const pageBreaks = tempDiv.querySelectorAll('.page-break, hr, [style*="page-break-before"], [style*="page-break-after"]');
    
    if (pageBreaks.length > 0) {
      // If we found explicit page breaks
      const pages = [];
      let currentPage = document.createElement('div');
      
      Array.from(tempDiv.childNodes).forEach(node => {
        if (pageBreaks.contains?.(node)) {
          // Found a page break, start a new page
          pages.push(currentPage.innerHTML);
          currentPage = document.createElement('div');
        } else {
          currentPage.appendChild(node.cloneNode(true));
        }
      });
      
      // Add the last page
      if (currentPage.innerHTML) {
        pages.push(currentPage.innerHTML);
      }
      
      return pages;
    } else {
      // If no explicit page breaks, use a simple heuristic to divide content
      // This is a simplified approach - you might want to improve this logic
      const elements = tempDiv.children;
      const elementsPerPage = 30; // Rough estimate
      const pages = [];
      
      let currentPageContent = '';
      let elementCount = 0;
      
      Array.from(elements).forEach(element => {
        currentPageContent += element.outerHTML;
        elementCount++;
        
        if (elementCount >= elementsPerPage) {
          pages.push(currentPageContent);
          currentPageContent = '';
          elementCount = 0;
        }
      });
      
      // Add remaining content as the last page
      if (currentPageContent) {
        pages.push(currentPageContent);
      }
      
      // If no pages were created, return the original content as a single page
      return pages.length > 0 ? pages : [content];
    }
  };
  
  // Process Word document
  export const processWordDocument = (file, setWordContent, setWordPages) => {
    if (!window.mammoth) {
      console.error('Mammoth.js library not loaded');
      setWordContent('<p>Error: Mammoth.js library not loaded</p>');
      return;
    }
  
    const reader = new FileReader();
    reader.onload = function(event) {
      const arrayBuffer = event.target.result;
      
      // Use mammoth.js to convert Word to HTML
      window.mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
        .then(function(result) {
          setWordContent(result.value);
          
          // Split content into pages
          const pages = splitWordContentIntoPages(result.value);
          setWordPages(pages);
        })
        .catch(function(error) {
          console.error('Error converting Word document:', error);
          setWordContent('<p>Error: Could not convert Word document</p>');
        });
    };
    reader.readAsArrayBuffer(file);
  };
  
  // Process Excel document
  export const processExcelDocument = (file, setExcelContent, setExcelSheets, setSheetContents) => {
    if (!window.XLSX) {
      console.error('SheetJS library not loaded');
      setExcelContent('<p>Error: SheetJS library not loaded</p>');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
      const data = new Uint8Array(event.target.result);
      try {
        // Parse the Excel file
        const workbook = window.XLSX.read(data, { type: 'array' });
        
        // Get all sheet names
        const sheets = workbook.SheetNames;
        setExcelSheets(sheets);
        
        // Process each sheet and store its HTML content
        const contents = {};
        sheets.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const html = window.XLSX.utils.sheet_to_html(worksheet);
          
          // Add styling to the table
          const styledHtml = `
            <div style="font-family: Arial, sans-serif;">
              <h3 style="margin-bottom: 10px;">${sheetName}</h3>
              <div style="overflow-x: auto;">
                ${html.replace('<table>', '<table style="border-collapse: collapse; width: 100%;">')
                     .replace(/<td/g, '<td style="border: 1px solid #ddd; padding: 8px;"')
                     .replace(/<th/g, '<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;"')}
              </div>
            </div>
          `;
          
          contents[sheetName] = styledHtml;
        });
        
        setSheetContents(contents);
        
        // Set the first sheet as default
        if (sheets.length > 0) {
          setExcelContent(contents[sheets[0]]);
        } else {
          setExcelContent('<p>No sheets found in this Excel file</p>');
        }
      } catch (error) {
        console.error('Error processing Excel file:', error);
        setExcelContent('<p>Error: Could not process Excel file</p>');
      }
    };
    reader.readAsArrayBuffer(file);
  };