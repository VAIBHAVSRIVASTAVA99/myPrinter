import React, { useState, useEffect, useRef } from 'react';

const PowerPointViewer = ({ file, printSettings }) => {
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [error, setError] = useState(null);
  const jsZipLoaded = useRef(false);

  useEffect(() => {
    if (!window.JSZip && !jsZipLoaded.current) {
      jsZipLoaded.current = true;
      const jsZipScript = document.createElement('script');
      jsZipScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      jsZipScript.async = true;
      jsZipScript.onload = () => {
        if (file) {
          parsePowerPointFile(file);
        }
      };
      jsZipScript.onerror = () => {
        setError('Failed to load PowerPoint processing library. Please try again later.');
        setLoading(false);
      };
      document.body.appendChild(jsZipScript);

      return () => {
        if (document.body.contains(jsZipScript)) {
          document.body.removeChild(jsZipScript);
        }
      };
    } else if (window.JSZip && file) {
      parsePowerPointFile(file);
    }
  }, [file]);

  const parsePowerPointFile = async (file) => {
    if (!file) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      if (!file.name.match(/\.(ppt|pptx)$/i)) {
        setError('File must be a PowerPoint document (.ppt or .pptx)');
        setLoading(false);
        return;
      }

      const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });

      try {
        const zip = await JSZip.loadAsync(arrayBuffer);

        const presentationXml = await zip.file("ppt/presentation.xml")?.async("text");
        if (!presentationXml) {
          throw new Error("Invalid PowerPoint file format");
        }

        const slideCount = (presentationXml.match(/<p:sldId/g) || []).length;

        const extractedSlides = await Promise.all(
          Array.from({ length: slideCount }, async (_, i) => {
            const slideIndex = i + 1;
            const slideXml = await zip.file(`ppt/slides/slide${slideIndex}.xml`)?.async("text");

            const titleMatch = slideXml?.match(/<a:t>(.*?)<\/a:t>/);
            const title = titleMatch ? titleMatch[1] : `Slide ${slideIndex}`;

            const thumbnailData = await zip.file(`ppt/media/image${slideIndex}.png`)?.async("base64");
            const thumbnailSrc = thumbnailData ? `data:image/png;base64,${thumbnailData}` : null;

            return {
              id: slideIndex,
              title: title,
              thumbnailSrc: thumbnailSrc || `/api/placeholder/${300}/${169}`,
            };
          })
        );

        setSlides(extractedSlides);
        setTotalSlides(extractedSlides.length);
        setActiveSlide(0);
        setLoading(false);
      } catch (err) {
        console.error('Error parsing PowerPoint data:', err);
        setError('Failed to parse PowerPoint file. The file might be corrupted or in an unsupported format.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error handling PowerPoint file:', err);
      setError('Failed to process PowerPoint file. Please ensure it is a valid PowerPoint document.');
      setLoading(false);
    }
  };

  const navigateToSlide = (slideIndex) => {
    if (slideIndex >= 0 && slideIndex < totalSlides) {
      setActiveSlide(slideIndex);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      navigateToSlide(activeSlide + 1);
    } else if (e.key === 'ArrowLeft') {
      navigateToSlide(activeSlide - 1);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSlide, totalSlides]);

  const defaultPrintSettings = {
    colorMode: 'color',
    orientation: 'portrait',
  };

  const currentPrintSettings = printSettings || defaultPrintSettings;

  const getSlideStyle = () => {
    const { colorMode } = currentPrintSettings;
    return {
      filter: colorMode === 'bw' ? 'grayscale(100%)' : 'none',
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
    };
  };

  const getOrientationStyle = () => {
    const { orientation } = currentPrintSettings;
    
    if (orientation === 'landscape') {
      return {
        width: '60vw',
        height: '60vh',  
        maxWidth: '100%',
        maxHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        backgroundColor: 'white',
      };
    } else {
      return {
        width: '80vw',
        height: '45vh',  
        maxWidth: '100%',
        maxHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        backgroundColor: 'white',
      };
    }
  };

  const settingsContainerStyle = {
    height: "10vh",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  }

  const settingButtonStyle = {
    padding: "8px 16px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "rgb(48, 131, 48)",
    color: "white",
    border: "none",
    borderRadius: "5px",
  }

  const colorMode = [
    {label: "Color", value:"color"},
    {label: "Black and White", value:"bw"},
  ]

  const orientationSize = [
    {label: "Landscape", value:"landscape"},
    {label: "Portrait", value:"portrait"},
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
        <p>Loading presentation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white text-center">
        <p className="text-red-600 mb-2">{error}</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setError(null)}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!file || slides.length === 0) {
    return (
      <div className="p-4 bg-white text-center">
        <p>No presentation loaded</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white" tabIndex="0">
      <div className="p-2 text-xs text-gray-500 border-t flex justify-between items-center" style={settingsContainerStyle}>
        {printSettings && <>
          <select
            value={printSettings.colorMode}
            onChange={(e) => printSettings.setColorMode(e.target.value)}
            style={settingButtonStyle}
          >
            {colorMode.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>

          <select
            value={printSettings.orientation}
            onChange={(e) => {
              printSettings.setOrientation(e.target.value);
              console.log("Orientation changed to:", e.target.value);
            }}
            style={settingButtonStyle}
          >
            {orientationSize.map((orient) => (
              <option key={orient.value} value={orient.value}>
                {orient.label}
              </option>
            ))}
          </select>
        </>}
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <div className="flex justify-between mb-2">
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600 transition"
              onClick={() => navigateToSlide(activeSlide - 1)}
              disabled={activeSlide === 0}
            >
              Previous
            </button>

            <span className="text-sm self-center">
              Slide {activeSlide + 1} of {totalSlides}
            </span>

            <button
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600 transition"
              onClick={() => navigateToSlide(activeSlide + 1)}
              disabled={activeSlide === totalSlides - 1}
            >
              Next
            </button>
          </div>

          <div style={getOrientationStyle()}>
            <img
              src={slides[activeSlide].thumbnailSrc}
              alt={`Slide ${activeSlide + 1}`}
              className="max-w-full max-h-full object-contain"
              style={getSlideStyle()}
            />
          </div>

          <div className="flex justify-center mt-2 space-x-1">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  activeSlide === index
                    ? 'bg-blue-500'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => navigateToSlide(index)}
                title={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerPointViewer;