import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const CaptureFrame = () => {
  const webcamRef = useRef(null);
  const [intervalId, setIntervalId] = useState(null);

  // Function to capture and send frame to Flask every second
  const captureFrame = async () => {
    if (webcamRef.current) {
      // Capture frame as a base64 image
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (imageSrc) {
        try {
          // Send image to Flask backend
          await fetch('http://localhost:5000/process-frame', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ frame: imageSrc }),
          });
        } catch (error) {
          console.error('Error sending frame:', error);
        }
      }
    }
  };

  // Start capturing frames every second
  useEffect(() => {
    const id = setInterval(captureFrame, 1000);
    setIntervalId(id);

    // Cleanup interval on unmount
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
      />
      <p>Capturing frames every second...</p>
    </div>
  );
};

export default CaptureFrame;
