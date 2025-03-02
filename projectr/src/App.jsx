import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import Preview from '../components/Preview';
import useFileHandling from '../components/hooks/UseFileHandling';
import logo from './components/logo.png';

const App = () => {
  const {
    selectedFile,
    selectedFiles,
    currentPreviewIndex,
    handleFileChange,
    removeFile,
    selectFileForPreview
  } = useFileHandling();

  const [printSettings, setPrintSettings] = useState({
    colorMode: "bw",
    orientation: "portrait",
    copies: 1,
    paperSize: "a4",
    doubleSided: false
  });

  const updatePrintSetting = (setting, value) => {
    setPrintSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  // Add navigation methods for files
  const navigatePreviousFile = () => {
    if (selectedFiles.length > 0) {
      const newIndex = (currentPreviewIndex - 1 + selectedFiles.length) % selectedFiles.length;
      selectFileForPreview(newIndex);
    }
  };

  const navigateNextFile = () => {
    if (selectedFiles.length > 0) {
      const newIndex = (currentPreviewIndex + 1) % selectedFiles.length;
      selectFileForPreview(newIndex);
    }
  };

  const [currentStep, setCurrentStep] = useState(2);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white border-b border-gray-900 shadow-sm sticky top-0 z-10">
        <div className="flex items-center">
          <img src={logo} alt="MyPrintCorner Logo" className="w-10 h-7" />
          <span className="ml-2 font-semibold text-gray-800 text-lg">myprintcorner.com</span>
        </div>
        <div className="flex items-center">
          <a href="#" className="text-blue-600 font-medium mr-6 hover:text-blue-800 transition-colors">Sign In</a>
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none transition-colors" 
                    onClick={() => document.getElementById('menuDropdown').classList.toggle('hidden')}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            
            <div id="menuDropdown" className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 hidden z-10">
              <ul className="py-1">
                <li>
                  <a href="#how-it-works" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md mx-1 transition-colors">
                    How it works?
                  </a>
                </li>
                <li>
                  <a href="#account" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md mx-1 transition-colors">
                    Account
                  </a>
                </li>
                <li>
                  <a href="#feedback" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md mx-1 transition-colors">
                    Feedback
                  </a>
                </li>
                <li>
                  <a href="#contact-us" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md mx-1 transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Stepper */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium transition-colors
                    ${step < currentStep ? 'bg-green-500' : step === currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    {step < currentStep ? (
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : step}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${step === currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step === 1 ? 'Upload Files' : 
                     step === 2 ? 'Print Settings' : 
                     step === 3 ? 'Select Location' : 'Order Summary'}
                  </span>
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - File Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="flex justify-center font-semibold text-lg text-gray-800">Preview</h2>
              </div>
              <div className="p-6">
                {selectedFile ? (
                  <Preview 
                    selectedFile={selectedFile}
                    printSettings={printSettings}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-gray-500">No file selected for preview</p>
                    <button 
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      onClick={() => document.getElementById('fileInput').click()}
                    >
                      Select a file
                    </button>
                    <input 
                      id="fileInput" 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                      multiple
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Section - Print Settings */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="flex justify-center font-semibold text-lg text-gray-800">Print Settings</h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Color Mode Setting */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color Mode</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center justify-center p-3 border ${printSettings.colorMode === "color" ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} rounded-lg cursor-pointer transition-colors`}>
                      <input
                        type="radio"
                        name="colorMode"
                        value="color"
                        checked={printSettings.colorMode === "color"}
                        onChange={() => updatePrintSetting("colorMode", "color")}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center">
                        <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="8" fill="#3B82F6" />
                          <circle cx="12" cy="12" r="8" fill="#EF4444" fillOpacity="0.5" />
                        </svg>
                        <span className={`text-sm ${printSettings.colorMode === "color" ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>Color</span>
                      </div>
                    </label>
                    <label className={`flex items-center justify-center p-3 border ${printSettings.colorMode === "bw" ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} rounded-lg cursor-pointer transition-colors`}>
                      <input
                        type="radio"
                        name="colorMode"
                        value="bw"
                        checked={printSettings.colorMode === "bw"}
                        onChange={() => updatePrintSetting("colorMode", "bw")}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center">
                        <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="8" fill="#4B5563" />
                        </svg>
                        <span className={`text-sm ${printSettings.colorMode === "bw" ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>Black & White</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Orientation Setting */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center justify-center p-3 border ${printSettings.orientation === "portrait" ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} rounded-lg cursor-pointer transition-colors`}>
                      <input
                        type="radio"
                        name="orientation"
                        value="portrait"
                        checked={printSettings.orientation === "portrait"}
                        onChange={() => updatePrintSetting("orientation", "portrait")}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center">
                        <svg className="w-6 h-8 mb-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="7" y="4" width="10" height="16" rx="1" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span className={`text-sm ${printSettings.orientation === "portrait" ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>Portrait</span>
                      </div>
                    </label>
                    <label className={`flex items-center justify-center p-3 border ${printSettings.orientation === "landscape" ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} rounded-lg cursor-pointer transition-colors`}>
                      <input
                        type="radio"
                        name="orientation"
                        value="landscape"
                        checked={printSettings.orientation === "landscape"}
                        onChange={() => updatePrintSetting("orientation", "landscape")}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center">
                        <svg className="w-8 h-6 mb-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="4" y="8" width="16" height="10" rx="1" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span className={`text-sm ${printSettings.orientation === "landscape" ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>Landscape</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Paper Size */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paper Size</label>
                  <select
                    value={printSettings.paperSize}
                    onChange={(e) => updatePrintSetting("paperSize", e.target.value)}
                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="a4">A4</option>
                    <option value="a3">A3</option>
                    <option value="letter">Letter</option>
                    <option value="legal">Legal</option>
                  </select>
                </div> */}

                {/* Copies */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Copies</label>
                  <div className="flex items-center">
                    <button 
                      className="px-3 py-1 bg-gray-200 rounded-l-md border border-gray-300 hover:bg-gray-300 transition-colors"
                      onClick={() => updatePrintSetting("copies", Math.max(1, printSettings.copies - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={printSettings.copies}
                      onChange={(e) => updatePrintSetting("copies", parseInt(e.target.value) || 1)}
                      className="w-16 py-1 px-3 text-center border-t border-b border-gray-300 focus:outline-none"
                    />
                    <button 
                      className="px-3 py-1 bg-gray-200 rounded-r-md border border-gray-300 hover:bg-gray-300 transition-colors"
                      onClick={() => updatePrintSetting("copies", printSettings.copies + 1)}
                    >
                      +
                    </button>
                  </div>
                </div> */}

                {/* Double-sided */}
                {/* <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={printSettings.doubleSided}
                      onChange={(e) => updatePrintSetting("doubleSided", e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Double-sided printing</span>
                  </label>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Files Section */}
      <div className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="flex justify-center font-semibold text-lg text-gray-800">Your Files</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-4">
                {selectedFiles.length > 0 && (
                  <button 
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={navigatePreviousFile}
                    disabled={selectedFiles.length <= 1}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <div className="flex-1 flex gap-4 overflow-x-auto py-4 px-2 items-start">
                  {selectedFiles.map((file, index) => (
                    <div 
                      key={index} 
                      className={`relative min-w-fit border-2 rounded-md p-2 cursor-pointer transition-all ${
                        index === currentPreviewIndex ? 'border-blue-500 shadow-md' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => selectFileForPreview(index)}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ✕
                      </button>
                      <FileUpload.FileItem file={file} isSelected={index === currentPreviewIndex} />
                    </div>
                  ))}
                  {/* Add File button */}
                  <div className="min-w-fit">
                    <label className="flex flex-col items-center justify-center w-28 h-28 bg-gray-50 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="mt-2 text-sm text-gray-500 font-medium">Add File</span>
                      <input type="file" className="hidden" onChange={handleFileChange} multiple />
                    </label>
                  </div>
                </div>
                {selectedFiles.length > 0 && (
                  <button 
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={navigateNextFile}
                    disabled={selectedFiles.length <= 1}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Action Button */}
      <div className="bg-white border-t border-gray-200 py-6 sticky bottom-0 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <button 
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium flex items-center hover:bg-gray-50 transition-colors"
            onClick={() => setCurrentStep(Math.max(2, currentStep - 1))}
            disabled={currentStep === 2}
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button 
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium flex items-center hover:bg-blue-700 transition-colors shadow-sm"
            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
          >
            {currentStep < 4 ? (
              <>
                {currentStep === 1 ? 'Continue to Print Settings' : 
                 currentStep === 2 ? 'Select Shop Location' : 'Review Order'}
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            ) : 'Confirm Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;