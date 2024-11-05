import React, { useState, useEffect } from 'react';
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
} from '@mui/material';

const tests = [
  {
    id: 1,
    title: 'Math Test',
    description: 'A comprehensive test on algebra and geometry.',
    date: '2024-10-20',
  },
  {
    id: 2,
    title: 'Science Test',
    description: 'Exploring the basics of physics and chemistry.',
    date: '2024-10-22',
  },
  {
    id: 3,
    title: 'History Test',
    description: 'A deep dive into ancient civilizations.',
    date: '2024-10-25',
  },
];

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [testLink, setTestLink] = useState('');
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [testData, setTestData] = useState(null);

  useEffect(() => {
    // Simulate data fetch with loading effect
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTestLink('');
  };

  const handleCheckLink = () => {
    setChecking(true);
    setTimeout(() => {
      // Simulate successful test link check and set test details
      setTestData({
        title: 'Sample Test',
        description: 'This is a sample description for the test.',
        duration: '60 minutes',
        start_time: '10:00 AM',
        end_time: '11:00 AM',
      });
      setChecking(false);
      setOpenDialog(false);
      setTestDialogOpen(true);
    }, 1500); // Simulating network delay
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Already Given Tests
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {tests.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ color: 'gray' }}>
              No tests have been given yet.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {tests.map((test) => (
                <Grid item xs={12} sm={6} md={4} key={test.id}>
                  <Card sx={{ background: '#e3f2fd', borderRadius: '15px', boxShadow: 3 }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        {test.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {test.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Date Given: {test.date}
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
      <Dialog open={testDialogOpen} onClose={() => setTestDialogOpen(false)}>
        <DialogTitle>Test Details</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{testData?.title}</Typography>
          <Typography>Description: {testData?.description}</Typography>
          <Typography>Duration: {testData?.duration}</Typography>
          <Typography>Start Time: {testData?.start_time}</Typography>
          <Typography>End Time: {testData?.end_time}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialogOpen(false)}>Cancel</Button>
          <Button color="primary" variant="contained">
            Start Test
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home;
