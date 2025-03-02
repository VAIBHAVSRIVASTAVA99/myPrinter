import React, { useState, useEffect } from 'react';

const ImagePreview = ({ file, printSettings }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewKey, setPreviewKey] = useState(0);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = fileUrl;
      
      return () => URL.revokeObjectURL(fileUrl);
    }
  }, [file]);
  
  useEffect(() => {
    setPreviewKey(prevKey => prevKey + 1);
  }, [printSettings.colorMode, printSettings.orientation]);
  
  if (!file) return <div className="flex items-center justify-center h-full">No image selected</div>;
  
  const getImageStyles = () => {
    const { colorMode, orientation } = printSettings;
    
    const styles = {
      filter: colorMode === 'bw' ? 'grayscale(100%)' : 'none',
      transition: 'all 0.3s ease',
    };
    
    if (orientation === 'landscape') {
      return {
        ...styles,
        width: '100%',
        height: 'auto',
        maxHeight: '100%',
        objectFit: 'contain'
      };
    } else {
      return {
        ...styles,
        height: '100%',
        width: 'auto',
        maxWidth: '100%',
        objectFit: 'contain'
      };
    }
  };
  
  const getContainerStyles = () => {
    const { orientation } = printSettings;
    
    const styles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      padding: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    };
    
    if (orientation === 'landscape') {
      return {
        ...styles,
        width: '100%',
        height: '75%', 
        aspectRatio: '4/3' 
      };
    } else {
      return {
        ...styles,
        width: '75%', 
        height: '100%',
        aspectRatio: '3/4' 
      };
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full w-full" key={previewKey}>
      {previewUrl ? (
        <div className="h-full w-full flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center overflow-hidden rounded border" style={getContainerStyles()}>
            <img
              src={previewUrl}
              alt={file.name}
              style={getImageStyles()}
            />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {file.name} ({Math.round(file.size / 1024)} KB) - 
            {printSettings.orientation.charAt(0).toUpperCase() + printSettings.orientation.slice(1)}, 
            {printSettings.colorMode === 'bw' ? 'Black & White' : 'Color'}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>Loading image preview...</p>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;