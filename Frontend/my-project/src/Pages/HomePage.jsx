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
import { ContentCopy, Delete } from '@mui/icons-material'; // Import Delete icon
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';

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

  useEffect(() => {
    if (!authToken) {
      navigate('/login');
    }
    fetchTests();
  }, [authToken, navigate]);

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
              onClick={() => {
                console.log(linkTestData);
                navigate('/exam', { state: { testData: linkTestData || selectedTestData } });
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
