import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, Paper, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText } from '@mui/material';
import { AuthContext } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function ExamPage() {
    const navigate = useNavigate();
    const { authToken } = useContext(AuthContext);
    const [timer, setTimer] = useState(0); // Timer in seconds
    const [answers, setAnswers] = useState({}); // Tracks user answers
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

    useEffect(() => {   
        if (!authToken) navigate('/login');

        const testDetails = location.state?.testDetails;
        // Calculate remaining time until test end and test duration
        const endTimeRemaining = Math.floor((new Date(testDetails.end_time).getTime() - new Date().getTime()) / 1000);
        const durationInSeconds = testDetails.duration * 60;

        // Set timer to minimum of endTimeRemaining or durationInSeconds
        const initialTimer = Math.min(endTimeRemaining, durationInSeconds);
        setTimer(initialTimer > 0 ? initialTimer : 0);

        // Countdown timer
        const countdown = setInterval(() => {
            setTimer(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(countdown);
                    handleSubmit(); // Auto-submit when timer ends
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(countdown); // Cleanup on component unmount
    }, [testDetails, authToken, navigate]);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prevAnswers => ({ ...prevAnswers, [questionId]: answer }));
    };

    const handleSubmit = () => {
        // Submit test logic here
        console.log("Submitting test with answers:", answers);
    };

    const handleDialogOpen = () => setIsSubmitDialogOpen(true);
    const handleDialogClose = () => setIsSubmitDialogOpen(false);

    const formattedTime = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={3}>
            <Typography variant="h4">{testDetails.title}</Typography>
            <Typography variant="subtitle1">User: {authToken.name} ({authToken.email})</Typography>
            <Typography variant="h6">Time Remaining: {formattedTime()}</Typography>
            
            <Box display="flex" mt={3}>
                {/* Sidebar for question numbers */}
                <Paper variant="outlined" style={{ width: '200px', marginRight: '20px' }}>
                    <List>
                        {testDetails.questions.map((question, index) => (
                            <ListItem key={question.id} button>
                                <ListItemText
                                    primary={`Q${index + 1}`}
                                    secondary={answers[question.id] ? "Answered" : "Unanswered"}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                {/* Main question display */}
                <Box flex={1}>
                    {testDetails.questions.map((question, index) => (
                        <Paper key={question.id} variant="outlined" style={{ padding: '20px', marginBottom: '10px' }}>
                            <Typography variant="h6">Question {index + 1}</Typography>
                            <Typography variant="body1">{question.text}</Typography>
                            {/* Add input for answer selection here */}
                            {/* Example: */}
                            <Button variant="contained" onClick={() => handleAnswerChange(question.id, 'Your Answer')}>Answer</Button>
                        </Paper>
                    ))}
                </Box>
            </Box>

            {/* Submit button and dialog */}
            <Button variant="contained" color="primary" onClick={handleDialogOpen} disabled={timer === 0}>
                Submit
            </Button>

            <Dialog open={isSubmitDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Submit Test</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to submit?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Submit</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ExamPage;
