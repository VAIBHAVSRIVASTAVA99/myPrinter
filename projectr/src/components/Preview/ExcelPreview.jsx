import React, { useState, useEffect, useRef } from 'react';

const ExcelPreview = ({ file, printSettings }) => {
  const [loading, setLoading] = useState(true);
  const [excelData, setExcelData] = useState([]);
  const [columnWidths, setColumnWidths] = useState([]);
  const [sheetNames, setSheetNames] = useState([]);
  const [activeSheet, setActiveSheet] = useState('');
  const [error, setError] = useState(null);
  const [previewKey, setPreviewKey] = useState(0);
  const sheetJsLoaded = useRef(false);

  useEffect(() => {
    setPreviewKey(prevKey => prevKey + 1);
  }, [printSettings.colorMode, printSettings.orientation, printSettings.paperSize]);

  useEffect(() => {
    if (!window.XLSX && !sheetJsLoaded.current) {
      sheetJsLoaded.current = true;
      const sheetjsScript = document.createElement('script');
      sheetjsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      sheetjsScript.async = true;
      sheetjsScript.onload = () => {
        if (file) {
          parseExcelFile(file);
        }
      };
      sheetjsScript.onerror = () => {
        setError('Failed to load Excel processing library. Please try again later.');
        setLoading(false);
      };
      document.body.appendChild(sheetjsScript);

      return () => {
        if (document.body.contains(sheetjsScript)) {
          document.body.removeChild(sheetjsScript);
        }
      };
    } else if (window.XLSX && file) {
      parseExcelFile(file);
    }
  }, [file]);

  const estimateColumnWidths = (data) => {
    if (!data || data.length === 0) return [];

    const maxCols = data.reduce((max, row) =>
      Array.isArray(row) ? Math.max(max, row.length) : max, 0);

    const widths = Array(maxCols).fill(100);

    data.forEach(row => {
      if (!Array.isArray(row)) return;

      row.forEach((cell, i) => {
        if (cell === null || cell === undefined) return;

        const content = cell.toString();
        const contentWidth = content.length * 8 + 16;
        widths[i] = Math.max(widths[i], contentWidth);
      });
    });

    return widths.map(w => Math.min(w, 300));
  };

  const parseExcelFile = async (file) => {
    if (!file) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = window.XLSX.read(data, { type: 'array' });

          const sheets = workbook.SheetNames;
          setSheetNames(sheets);

          if (sheets.length > 0) {
            const firstSheet = sheets[0];
            setActiveSheet(firstSheet);

            const worksheet = workbook.Sheets[firstSheet];
            const jsonData = window.XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const widths = estimateColumnWidths(jsonData);
            setColumnWidths(widths);

            setExcelData(jsonData);
            setLoading(false);
          } else {
            setError('No sheets found in the Excel file.');
            setLoading(false);
          }
        } catch (err) {
          console.error('Error parsing Excel data:', err);
          setError('Failed to parse Excel file. The file might be corrupted or in an unsupported format.');
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read Excel file. Please try again.');
        setLoading(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error('Error handling Excel file:', err);
      setError('Failed to process Excel file. Please ensure it is a valid Excel document.');
      setLoading(false);
    }
  };

  const changeSheet = (sheetName) => {
    if (window.XLSX && file) {
      setLoading(true);

      try {
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = window.XLSX.read(data, { type: 'array' });

            const worksheet = workbook.Sheets[sheetName];
            const jsonData = window.XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const widths = estimateColumnWidths(jsonData);
            setColumnWidths(widths);

            setActiveSheet(sheetName);
            setExcelData(jsonData);
            setLoading(false);
          } catch (err) {
            console.error('Error parsing Excel sheet:', err);
            setError(`Failed to parse sheet "${sheetName}".`);
            setLoading(false);
          }
        };

        reader.readAsArrayBuffer(file);
      } catch (err) {
        console.error('Error handling Excel file:', err);
        setError('Failed to process Excel file.');
        setLoading(false);
      }
    }
  };

  const isNumeric = (value) => {
    if (typeof value === 'number') return true;
    if (typeof value !== 'string') return false;

    return /^[$€£¥]?\s?-?[\d,]+(\.\d+)?%?$/.test(value.trim());
  };

  const formatCellContent = (content) => {
    if (content === null || content === undefined) return '';
    return content.toString();
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

  const getTableStyles = () => {
    const { colorMode } = printSettings || {};
    
    return {
      filter: colorMode === 'bw' ? 'grayscale(100%)' : 'none',
      transition: 'all 0.3s ease',
      margin: '0 auto',
      width: '100%'
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg" style={getContainerStyle()}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-600">Loading Excel preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg" style={getContainerStyle()}>
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p className="text-center text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg" style={getContainerStyle()}>
          <p className="text-gray-500">No Excel file selected</p>
        </div>
      </div>
    );
  }

  const formatPaperSize = (size) => {
    if (!size) return 'A4';
    if (size.toLowerCase().startsWith('a')) {
      return size.toUpperCase();
    }
    return size.charAt(0).toUpperCase() + size.slice(1);
  };

  return (
    <div className="flex items-center justify-center w-full h-full" style={getWrapperStyle()}>
      <div className="border rounded-lg bg-white" style={getContainerStyle()} key={previewKey}>
        <div className="p-2 bg-green-100 text-green-800 font-medium border-b flex justify-between items-center">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm1 0v12h12V4H4z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M13 8H7V6h6v2zm0 3H7V9h6v2zm0 3H7v-2h6v2z" clipRule="evenodd" />
            </svg>
            <span>{file.name} ({Math.round(file.size / 1024)} KB)</span>
          </div>

          {/* Display print settings info */}
          <div className="text-xs flex items-center space-x-2">
            <span>{printSettings?.colorMode === 'bw' ? 'B&W' : 'Color'}</span>
            <span>•</span>
            <span>{printSettings?.orientation === 'landscape' ? 'Landscape' : 'Portrait'}</span>
            <span>•</span>
            <span>{formatPaperSize(printSettings?.paperSize)}</span>
          </div>

          {/* Sheet tabs */}
          {sheetNames.length > 1 && (
            <div className="flex space-x-1 overflow-x-auto max-w-md">
              {sheetNames.map((sheet) => (
                <button
                  key={sheet}
                  className={`px-3 py-1 text-sm rounded-t-md transition-colors duration-150 ease-in-out whitespace-nowrap
                    ${activeSheet === sheet
                      ? 'bg-white text-green-800 border-t border-l border-r border-green-300 font-medium'
                      : 'bg-green-50 text-green-700 hover:bg-green-200'}`}
                  onClick={() => changeSheet(sheet)}
                >
                  {sheet}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-auto flex-1" style={{ overflowY: "auto", overflowX: "auto" }}>
          {excelData.length > 0 ? (
            <div style={getTableStyles()}>
              <table className="min-w-full border-collapse table-fixed">
                <tbody>
                  {excelData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={
                        rowIndex === 0
                          ? 'bg-green-100 sticky top-0 z-10'
                          : rowIndex % 2 === 0
                            ? 'bg-gray-50 hover:bg-gray-100'
                            : 'bg-white hover:bg-gray-100'
                      }
                    >
                      {/* Add row index column */}
                      <td className="border px-2 py-1 text-gray-500 bg-gray-100 text-center font-mono text-xs sticky left-0 z-10 w-12">
                        {rowIndex + 1}
                      </td>

                      {/* Generate empty cells if row is empty or undefined */}
                      {(!row || row.length === 0) ? (
                        <td className="border px-4 py-2">&nbsp;</td>
                      ) : (
                        // Map through actual row data
                        Array.isArray(row) && row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={`border px-4 py-2 ${
                              rowIndex === 0
                                ? 'font-medium text-green-800'
                                : ''
                            } ${
                              isNumeric(cell)
                                ? 'text-right font-mono'
                                : ''
                            }`}
                            style={{
                              width: columnWidths[cellIndex] ? `${columnWidths[cellIndex]}px` : 'auto',
                              maxWidth: '300px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                            title={cell !== undefined && cell !== null ? cell.toString() : ''}
                          >
                            {formatCellContent(cell)}
                          </td>
                        ))
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No data found in this sheet</p>
            </div>
          )}
        </div>

        <div className="p-2 text-xs text-gray-500 border-t flex justify-between items-center">
          <p>Note: This is a simplified preview. Some advanced Excel features and formatting may not be displayed.</p>
          <div>{excelData.length} rows</div>
        </div>
      </div>
    </div>
  );
};

export default ExcelPreview;