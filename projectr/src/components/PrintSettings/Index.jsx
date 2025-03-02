import React, { useState, useEffect } from 'react';

// CopiesControl Component
const CopiesControl = ({
  copies,
  setCopies,
  pageSelection,
  setPageSelection
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-800">Copies & Pages</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="copies" className="block text-sm font-medium text-gray-700">
            Number of copies
          </label>
          <input
            type="number"
            id="copies"
            name="copies"
            min="1"
            value={copies}
            onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
            className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="pageSelection" className="block text-sm font-medium text-gray-700">
            Pages
          </label>
          <select
            id="pageSelection"
            name="pageSelection"
            value={pageSelection}
            onChange={(e) => setPageSelection(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All Pages</option>
            <option value="current">Current Page</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// ColorModeControl Component 
const ColorModeControl = ({
  colorMode,
  setColorMode
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-800">Color Mode</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="colorMode" className="block text-sm font-medium text-gray-700">
            Output
          </label>
          <select
            id="colorMode"
            name="colorMode"
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="color">Color</option>
            <option value="grayscale">Black & White</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// PaperSettings Component
const PaperSettings = ({
  paperSize: initialPaperSize,
  setPaperSize: externalSetPaperSize,
  paperType: initialPaperType,
  setPaperType: externalSetPaperType,
  onSettingsChange // Add callback for when settings change
}) => {
  // Fallback to internal state if props aren't functions
  const [internalPaperSize, setInternalPaperSize] = useState(initialPaperSize || 'letter');
  const [internalPaperType, setInternalPaperType] = useState(initialPaperType || 'plain');
  
  // Use external setters if they exist and are functions, otherwise use internal state
  const handlePaperSizeChange = (e) => {
    const newValue = e.target.value;
    if (typeof externalSetPaperSize === 'function') {
      externalSetPaperSize(newValue);
    } else {
      setInternalPaperSize(newValue);
    }
    
    // Notify parent component that settings have changed
    if (typeof onSettingsChange === 'function') {
      onSettingsChange({
        paperSize: newValue,
        paperType: displayPaperType
      });
    }
  };
  
  const handlePaperTypeChange = (e) => {
    const newValue = e.target.value;
    if (typeof externalSetPaperType === 'function') {
      externalSetPaperType(newValue);
    } else {
      setInternalPaperType(newValue);
    }
    
    // Notify parent component that settings have changed
    if (typeof onSettingsChange === 'function') {
      onSettingsChange({
        paperSize: displayPaperSize,
        paperType: newValue
      });
    }
  };
  
  // Use either the props or internal state
  const displayPaperSize = typeof externalSetPaperSize === 'function' ? initialPaperSize : internalPaperSize;
  const displayPaperType = typeof externalSetPaperType === 'function' ? initialPaperType : internalPaperType;
  
  // Trigger onSettingsChange when component mounts to initialize with current settings
  useEffect(() => {
    if (typeof onSettingsChange === 'function') {
      onSettingsChange({
        paperSize: displayPaperSize,
        paperType: displayPaperType
      });
    }
  }, []);
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-800">Paper</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="paperSize" className="block text-sm font-medium text-gray-700">
            Size
          </label>
          <select
            id="paperSize"
            name="paperSize"
            value={displayPaperSize}
            onChange={handlePaperSizeChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="letter">Letter (8.5" x 11")</option>
            <option value="legal">Legal (8.5" x 14")</option>
            <option value="a4">A4 (210 x 297 mm)</option>
            <option value="a3">A3 (297 x 420 mm)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="paperType" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="paperType"
            name="paperType"
            value={displayPaperType}
            onChange={handlePaperTypeChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="plain">Plain Paper</option>
            <option value="photo">Photo Paper</option>
            <option value="glossy">Glossy</option>
            <option value="matte">Matte</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// LayoutSettings Component
const LayoutSettings = ({
  margins,
  setMargins,
  orientation,
  setOrientation,
  borderSize,
  setBorderSize,
  duplexPrinting,
  setDuplexPrinting
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-800">Layout</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="margins" className="block text-sm font-medium text-gray-700">
            Margins
          </label>
          <select
            id="margins"
            name="margins"
            value={margins}
            onChange={(e) => setMargins(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="normal">Normal</option>
            <option value="narrow">Narrow</option>
            <option value="wide">Wide</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="orientation" className="block text-sm font-medium text-gray-700">
            Orientation
          </label>
          <select
            id="orientation"
            name="orientation"
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="borderSize" className="block text-sm font-medium text-gray-700">
            Border
          </label>
          <select
            id="borderSize"
            name="borderSize"
            value={borderSize}
            onChange={(e) => setBorderSize(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="none">None</option>
            <option value="thin">Thin</option>
            <option value="medium">Medium</option>
            <option value="thick">Thick</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="duplexPrinting" className="block text-sm font-medium text-gray-700">
            Duplex
          </label>
          <select
            id="duplexPrinting"
            name="duplexPrinting"
            value={duplexPrinting}
            onChange={(e) => setDuplexPrinting(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="single">Single-sided</option>
            <option value="long-edge">Double-sided (Long Edge)</option>
            <option value="short-edge">Double-sided (Short Edge)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Main PrintSettings Component
const PrintSettings = ({
  copies,
  setCopies,
  pageSelection,
  setPageSelection,
  colorMode,
  setColorMode,
  paperSize,
  setPaperSize,
  paperType,
  setPaperType,
  margins,
  setMargins,
  orientation,
  setOrientation,
  borderSize,
  setBorderSize,
  duplexPrinting,
  setDuplexPrinting
}) => {
  return (
    <div className="print-settings bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-medium mb-4">Print Settings</h2>
      
      <div className="space-y-6">
        {/* Copies and Page Selection */}
        <CopiesControl
          copies={copies}
          setCopies={setCopies}
          pageSelection={pageSelection}
          setPageSelection={setPageSelection}
        />
        
        {/* Color Mode */}
        <ColorModeControl
          colorMode={colorMode}
          setColorMode={setColorMode}
        />
        
        {/* Paper Settings */}
        <PaperSettings
          paperSize={paperSize}
          setPaperSize={setPaperSize}
          paperType={paperType}
          setPaperType={setPaperType}
        />
        
        {/* Layout Settings */}
        <LayoutSettings
          margins={margins}
          setMargins={setMargins}
          orientation={orientation}
          setOrientation={setOrientation}
          borderSize={borderSize}
          setBorderSize={setBorderSize}
          duplexPrinting={duplexPrinting}
          setDuplexPrinting={setDuplexPrinting}
        />
      </div>
    </div>
  );
};

export default PrintSettings;