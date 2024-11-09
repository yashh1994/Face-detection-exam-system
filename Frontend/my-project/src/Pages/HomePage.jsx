import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { useRef } from 'react';
import { ContentCopy, Delete } from '@mui/icons-material'; // Import Delete icon
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';

import Webcam from 'react-webcam';
const Home = () => {
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [testLink, setTestLink] = useState('');
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [selectedTestData, setSelectedTestData] = useState(null);
  const [linkTestData, setLinkTestData] = useState(null);
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [webcamDialogOpen,setWebcamDialogOpen] = useState(false)
  const [borderColor, setBorderColor] = useState('gray');
  const webcamRef = useRef(null);

  useEffect(() => {
    if (!authToken) {
      navigate('/login');
    }
    fetchTests();
  }, [authToken, navigate]);

  const handleWebcamStart = () => {
    const intervalId = setInterval(async () => {
        if (webcamRef.current) {
            const frameMatrix = getFrameMatrix();
            if (frameMatrix) {
                try {
                  const response = await fetch(`${config.apiUrl}/check-position`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      frame: frameMatrix,
                    }),
                  });
                    setBorderColor(response.data.is_in_position ? 'green' : 'red');
                } catch (error) {
                  console.log(error)
                    alert('Error sending frame:', error)
                    setWebcamDialogOpen(false);
                    return ()=>clearInterval(intervalId);
                }
            }
        }
    }, 1000);

    return () => clearInterval(intervalId); // Clear interval on dialog close
};


const getFrameMatrix = () => {
  const canvas = document.createElement('canvas');
  const video = webcamRef.current.video;

  if (video && video.videoWidth > 0 && video.videoHeight > 0) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image data (matrix) from the canvas
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
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
  } else {
    console.warn("Video feed not ready or has zero width/height.");
    return null; 
  }
};


  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.apiUrl}/get-my-test/${authToken.id}`);
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTestLink('');
  };

  const handleCheckLink = async () => {
    setChecking(true);
    try {
      const response = await axios.get(`${config.apiUrl}/get-test/${testLink}`);
      setLinkTestData(response.data);
      setOpenDialog(false);
      setTestDialogOpen(true);
    } catch (error) {
      console.error('Invalid test link:', error);
      alert('Invalid test link. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const handleTestCardClick = (test) => {
    setSelectedTestData(test);
    setTestDialogOpen(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard');
  };



  const handleDeleteTest = async (testId) => {
    console.log(`Deleting test with ID: ${testId}`);
    try {
      // Make a delete request to the API
      await axios.delete(`${config.apiUrl}/delete-test/${authToken['id']}/${testId}`);
      // Update the tests state to remove the deleted test
      alert('Test deleted successfully');
      setTests(tests.filter((test) => test.id !== testId));
    } catch (error) {
      console.error('Error deleting test:', error);
      alert('Failed to delete test');
    }
  };

  function handleStartTest(){
    setWebcamDialogOpen(false);
      console.log(linkTestData);
      navigate('/exam', { state: { testData: linkTestData || selectedTestData } });
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        User-Created Tests
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {tests.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ color: 'gray' }}>
              No tests available.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {tests.map((test) => (
                <Grid item xs={12} sm={6} md={4} key={test.id}>
                  <Card
                    onClick={() => handleTestCardClick(test)}
                    sx={{
                      background: '#e3f2fd',
                      borderRadius: '15px',
                      boxShadow: 3,
                      cursor: 'pointer',
                      position: 'relative',
                      '&:hover': { boxShadow: 6 },
                    }}
                  >
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click event
                        handleDeleteTest(test.open_link);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'red',
                      }}
                    >
                      <Delete />
                    </IconButton>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        {test.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {test.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Duration: {test.duration} minutes
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                borderRadius: '20px',
                padding: '10px 20px',
                '&:hover': {
                  backgroundColor: '#1976d2',
                },
              }}
              onClick={handleOpenDialog}
            >
              Give Test
            </Button>
          </Box>
        </>
      )}
      {/* For the Cechking the Position dialog */}
      <Dialog open={webcamDialogOpen} onClose={() => setWebcamDialogOpen(false)}>
        <DialogTitle>Adjust Position</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              border: `4px solid ${borderColor}`,
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
           { webcamDialogOpen && <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={320}
          height={240}
          onUserMedia={handleWebcamStart}
        />}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWebcamDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleStartTest} color="primary" variant="contained">
            Start
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for test link input */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Enter Test Link</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the link of the test you want to give and click "Check" to verify the link.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Test Link"
            type="url"
            fullWidth
            variant="outlined"
            value={testLink}
            onChange={(e) => setTestLink(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCheckLink} color="primary" disabled={!testLink || checking}>
            {checking ? <CircularProgress size={24} /> : 'Check'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Test Details Dialog */}
      {(selectedTestData || linkTestData) && (
        <Dialog open={testDialogOpen} onClose={() => setTestDialogOpen(false)}>
          <DialogTitle>{(selectedTestData || linkTestData).title}</DialogTitle>
          <DialogContent>
            <Typography>Description: {(selectedTestData || linkTestData).description}</Typography>
            <Typography>Duration: {(selectedTestData || linkTestData).duration} minutes</Typography>
            <Typography>Start Time: {(selectedTestData || linkTestData).start_time}</Typography>
            <Typography>End Time: {(selectedTestData || linkTestData).end_time}</Typography>
            <Box display="flex" alignItems="center">
              <Typography>Open Link: {(selectedTestData || linkTestData).open_link}</Typography>
              <IconButton onClick={() => copyToClipboard((selectedTestData || linkTestData).open_link)}>
                <ContentCopy />
              </IconButton>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTestDialogOpen(false)}>Close</Button>
            <Button
              color="primary"
              variant="contained"
              onClick={()=>{
                setTestDialogOpen(false)
                setWebcamDialogOpen(true)
              }}
            >
              Start Test
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Home;
