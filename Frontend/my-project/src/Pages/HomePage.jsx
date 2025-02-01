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
  Tooltip,
} from '@mui/material';
import { useRef } from 'react';
import { Close, ContentCopy, Delete } from '@mui/icons-material'; // Import Delete icon
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';

import Webcam from 'react-webcam';

const Home = () => {
  const [givenTests, setGivenTests] = useState([])
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
  const [webcamDialogOpen, setWebcamDialogOpen] = useState(false)
  const [borderColor, setBorderColor] = useState('gray');
  const webcamRef = useRef(null);
  const [frameCount,setFrameCount] = useState(0)
  const [intervalId, setIntervalId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState(null); // Store the test to delete
  const [isGivenTest, setIsGivenTest] = useState(false);
  useEffect(() => {
    if (!authToken) {
      navigate('/login');
    }
    fetchTests();
    fetchGivenTests()
    console.log(givenTests)
  }, [authToken, navigate]);

  useEffect(() => {
    if(webcamDialogOpen){
      const id = setInterval(handleWebcamStart, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    }else {
      clearInterval(intervalId);
    }
  }, [frameCount,webcamDialogOpen]);

  const handleWebcamStart = async () => {
    console.log("Web cam start ...");
      if (webcamRef.current) {
        const frameMatrix = getFrameMatrix();
        console.log("got the frame.");
        if (frameMatrix) {
          try {
            const response = await axios.post(`${config.apiUrl}/check-position`, {
              frame: frameMatrix,
            }, {
              headers: {
              'Content-Type': 'application/json',
              },
            });
  
            console.log("Check Position: ",response.data.is_in_position);
            setBorderColor(response.data.is_in_position == "True" ? 'green' : 'red');
            setFrameCount((prevCount) => prevCount + 1);
            } catch (error) {
            console.log(error);
            alert('Error sending frame:', error);
            setWebcamDialogOpen(false);
          }
        }
      }else{
        console.log("first")
      }
  };


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

  const fetchGivenTests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.apiUrl}/get-given-tests/${authToken.id}`);
      setGivenTests(response.data);
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


  

  const handleDeleteTest = (test) => {
    setTestToDelete(test); // Set the test to delete
    setDeleteDialogOpen(true); // Open confirmation dialog
  };

  const confirmDeleteTest = async () => {
    console.log(testToDelete)
    try {
      await axios.delete(`${config.apiUrl}/delete-test/${authToken['id']}/${testToDelete.open_link}`);
      alert('Test deleted successfully');
      setTests(tests.filter((test) => test.id !== testToDelete.id));
    } catch (error) {
      console.error('Error deleting test:', error);
      alert('Failed to delete test');
    } finally {
      setDeleteDialogOpen(false); // Close confirmation dialog
    }
  };

  function handleStartTest() {
    setWebcamDialogOpen(false);
    const currentTime = new Date();
    const endTime = new Date((linkTestData || selectedTestData).end_time);
    const startTime = new Date((linkTestData || selectedTestData).start_time);
    if (currentTime < startTime || currentTime > endTime) {
      alert('The test is not available at this time.');
      return;
    }
    const testId = (linkTestData || selectedTestData).id;
    const hasGivenTest = givenTests.some(test => test.test_id == testId);
    
    console.log(hasGivenTest)
    console.log(testId)
    console.log(givenTests)
    if (hasGivenTest) {
      alert('You have already given this test.');
      return;
    }
    console.log(linkTestData || selectedTestData);
    navigate('/exam', { state: { testData: linkTestData || selectedTestData } });
  }

  return (
    <Container sx={{ mt: 4, background: 'linear-gradient(120deg, #e3f2fd, #f9fbe7)', p: 3, borderRadius: 3 }}>
    <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 4 }}>
      Created Tests
    </Typography>

    {loading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    ) : (
      <>
        {tests.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ color: '#757575' }}>
            No tests available.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {tests.map((test) => (
              <Grid item xs={12} sm={6} md={4} key={test.id}>
                <Card
                  onClick={() => {
                    setIsGivenTest(false);
                    handleTestCardClick(test);
                  }}
                  sx={{
                    background: 'white',
                    borderRadius: '15px',
                     position: 'relative',
                    boxShadow: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
                  }}
                >
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      handleDeleteTest(test);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: 'red',
                      '&:hover': { color: '#d32f2f' },
                    }}
                  >
                    <Delete />
                  </IconButton>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ color: '#1a237e' }}>
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
            size="large"
            sx={{
              borderRadius: '30px',
              px: 4,
              py: 1.5,
              background: 'linear-gradient(90deg, #1e88e5, #1976d2)',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: 3,
              '&:hover': {
                background: 'linear-gradient(90deg, #1565c0, #0d47a1)',
                boxShadow: 6,
              },
            }}
            onClick={()=>{
              navigate('/create-test')
            }}
          >
            Creat Test
          </Button>
        </Box>
      </>
    )}

    <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1a237e', mt: 6, mb: 4 }}>
      Given Tests
    </Typography>

    {loading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    ) : (
      <>
        {givenTests.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ color: '#757575' }}>
            No tests available.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {givenTests.map((test) => (
              <Grid item xs={12} sm={6} md={4} key={test.id}>
                <Card
                  onClick={() => {
                    setIsGivenTest(true);
                    handleTestCardClick(test);
                  }}
                  sx={{
                    background: '#fce4ec',
                    borderRadius: '15px',
                    boxShadow: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ color: '#880e4f' }}>
                      {test.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {test.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Score: {test.exam_score} 
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
            size="large"
            sx={{
              borderRadius: '30px',
              px: 4,
              py: 1.5,
              background: 'linear-gradient(90deg, #1e88e5, #1976d2)',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: 3,
              '&:hover': {
                background: 'linear-gradient(90deg, #1565c0, #0d47a1)',
                boxShadow: 6,
              },
            }}
            onClick={handleOpenDialog}
          >
            Give Test
          </Button>
        </Box>
      </>
    )}

      {/* Delete Confirmation Dialog */}
<Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Test</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the test "{testToDelete?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteTest} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>


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
            {webcamDialogOpen && <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
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
  <Dialog
    open={testDialogOpen}
    onClose={() => setTestDialogOpen(false)}
    fullWidth
    maxWidth="sm"
  >
    <DialogTitle>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" component="span">
          {(selectedTestData || linkTestData).title}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          {
            !isGivenTest && (<Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => copyToClipboard((selectedTestData || linkTestData).open_link)}
            startIcon={<ContentCopy />}
          >
            Copy Link
          </Button>)}
          <IconButton onClick={() => setTestDialogOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      </Box>
    </DialogTitle>
    <DialogContent dividers>
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="body1">
          <strong>Description:</strong> {(selectedTestData || linkTestData).description}
        </Typography>
        <Typography variant="body1">
          <strong>Duration:</strong> {(selectedTestData || linkTestData).duration} minutes
        </Typography>
        <Typography variant="body1">
          <strong>Start Time:</strong> {(selectedTestData || linkTestData).start_time}
        </Typography>
        <Typography variant="body1">
          <strong>End Time:</strong> {(selectedTestData || linkTestData).end_time}
        </Typography>
        {isGivenTest && (<Typography variant="body1">
          <strong>Score :</strong> {(selectedTestData || linkTestData).exam_score}
        </Typography>)}
        {!isGivenTest && (<Box
          display="flex"
          alignItems="center"
          bgcolor="background.paper"
          borderRadius={1}
          padding={1}
          boxShadow={1}
        >
          <Typography variant="body1 break-all">
            <strong>Open Link:</strong> {(selectedTestData || linkTestData).open_link}
          </Typography>
        </Box>)}
      </Box>
    </DialogContent>
    <DialogActions sx={{ padding: "16px" }}>
      <Button
        onClick={() => setTestDialogOpen(false)}
        variant="outlined"
        color="secondary"
      >
        Close
      </Button>
      {!isGivenTest && (<Button
        onClick={() => {
          const currentTime = new Date();
          const endTime = new Date((linkTestData || selectedTestData).end_time);
          if (currentTime > endTime) {
            alert('The test has expired and can no longer be taken.');
            return;
          }
          setTestDialogOpen(false);
          setWebcamDialogOpen(true);
        }}
        variant="contained"
        color="primary"
      >
        Start Test
      </Button>)}
    </DialogActions>
  </Dialog>
)}

    </Container>
  );
};

export default Home;
