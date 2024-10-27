import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const CaptureFrame = () => {
  const webcamRef = useRef(null);
  const [intervalId, setIntervalId] = useState(null);
  const [frameCount, setFrameCount] = useState(0);
  const [resultData, setResultData] = useState(null);

  // Helper function to get frame in matrix form
  const getFrameMatrix = () => {
    const canvas = document.createElement('canvas');
    const video = webcamRef.current.video;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image data (matrix) from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;

    // Convert image data to a 2D matrix of RGB values
    const matrix = [];
    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        const index = (i * width + j) * 4;
        row.push([data[index], data[index + 1], data[index + 2]]);
      }
      matrix.push(row);
    }
    return matrix;
  };

  // Function to capture and send frame matrix to Flask
  const captureFrame = async () => {
    if (webcamRef.current) {
      const frameMatrix = getFrameMatrix();
      if (frameMatrix) {
        try {
          await fetch('http://localhost:5000/process_frame', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              student_id: 'student_1', // Add an identifier for the student
              frame: frameMatrix,
            }),
          });
          setFrameCount((prevCount) => prevCount + 1);
        } catch (error) {
          console.error('Error sending frame:', error);
        }
      }
    }
  };

  useEffect(() => {
    if (frameCount < 15) {
      const id = setInterval(captureFrame, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else {
      clearInterval(intervalId);
      fetchEndProcess();
    }
  }, [frameCount]);

  const fetchEndProcess = async () => {
    try {
      const response = await fetch(`http://localhost:5000/end_process?student_id=student_1`, {
        method: 'GET',
      });
      const data = await response.json();
      setResultData(data);
    } catch (error) {
      console.error('Error fetching end process data:', error);
    }
  };
  

  return (
    <div>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
      />
      <p>Capturing frames every second...</p>
      {resultData && (
        <div>
          <h3>Result Data:</h3>
          <pre>{JSON.stringify(resultData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CaptureFrame;
