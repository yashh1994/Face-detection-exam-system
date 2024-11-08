import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, Paper, Grid, FormControl, FormControlLabel, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, RadioGroup, Radio } from '@mui/material';
import { AuthContext } from '../Auth/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

function ExamPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { authToken } = useContext(AuthContext);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timer, setTimer] = useState(0);
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
    const testDetails = location.state?.testData;

    useEffect(() => {
        if (!authToken) navigate('/login');
        if (!testDetails) navigate('/home');

        const endTimeRemaining = Math.floor((new Date(testDetails.end_time).getTime() - new Date().getTime()) / 1000);
        const durationInSeconds = testDetails.duration * 60;
        const initialTimer = Math.min(endTimeRemaining, durationInSeconds);
        setTimer(initialTimer > 0 ? initialTimer : 0);

        const countdown = setInterval(() => {
            setTimer(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(countdown);
                    handleSubmit();
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [testDetails, authToken, navigate]);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prevAnswers => {
            const updatedAnswers = { ...prevAnswers };
            if (testDetails.questions[currentQuestionIndex].answerType !== "single") {
                // If multi-choice, toggle in array
                if (updatedAnswers[questionId]) {
                    if (updatedAnswers[questionId].includes(answer)) {
                        updatedAnswers[questionId] = updatedAnswers[questionId].filter(a => a !== answer);
                    } else {
                        updatedAnswers[questionId] = [...updatedAnswers[questionId], answer];
                    }
                } else {
                    updatedAnswers[questionId] = [answer];
                }
            } else {
                // For single-answer, replace the value
                updatedAnswers[questionId] = answer;
            }
            return updatedAnswers;
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < testDetails.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        console.log("Submitting test with answers:", answers);
    };

    const handleDialogOpen = () => setIsSubmitDialogOpen(true);
    const handleDialogClose = () => setIsSubmitDialogOpen(false);

    const formattedTime = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const currentQuestion = testDetails.questions[currentQuestionIndex];

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={3} sx={{ fontFamily: 'Roboto, sans-serif' }}>
            {/* Top Bar */}
            <Box width="100%" display="flex" justifyContent="space-between" alignItems="center" p={2} mb={2} sx={{ borderBottom: '2px solid #007BFF' }}>
                <Typography variant="h5" color="primary">{testDetails.title}</Typography>
                <Typography variant="body2" color="textSecondary">{testDetails.description}</Typography>
                <Typography variant="h6" color="textSecondary">Time Left: {formattedTime()}</Typography>
            </Box>

            {/* Question Grid */}
            <Box width="100%" mb={2}>
                <Grid container spacing={1} justifyContent="center">
                    {testDetails.questions.map((question, index) => (
                        <Grid item xs={2} key={index}>
                            <Paper 
                                elevation={3} 
                                sx={{
                                    width: '40px', 
                                    height: '40px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                    backgroundColor: answers[question.id] ? 'lightgreen' : (currentQuestionIndex === index ? 'lightblue' : '#f5f5f5'),
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: '#007BFF', color: 'white' },
                                    transition: 'background-color 0.3s ease, color 0.3s ease'
                                }}
                                onClick={() => setCurrentQuestionIndex(index)}
                            >
                                <Typography variant="body2">{index + 1}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Question Display */}
            <Box width="100%" display="flex" flexDirection="column" alignItems="center" p={2} mb={2} sx={{ border: '2px solid #007BFF', borderRadius: '8px' }}>
                <Typography variant="h6" color="primary">Question {currentQuestionIndex + 1}</Typography>
                <Typography variant="body1" mb={2}>{currentQuestion.questionText}</Typography>
                <FormControl component="fieldset">
                    {currentQuestion.answerType === "single" ? (
                        <RadioGroup value={answers[currentQuestion.id] || ''} onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}>
                            {currentQuestion.options.map((option, index) => (
                                <FormControlLabel 
                                    key={index} 
                                    value={option.text} 
                                    control={<Radio />} 
                                    label={option.text} 
                                    sx={{ '& .MuiRadio-root': { color: '#007BFF' }, '& .MuiFormControlLabel-label': { fontSize: '1rem' }}}
                                />
                            ))}
                        </RadioGroup>
                    ) : (
                        <Grid container spacing={2}>
                            {currentQuestion.options.map((option, index) => (
                                <Grid item xs={12} key={index}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox 
                                                checked={answers[currentQuestion.id]?.includes(option.text) || false}
                                                onChange={() => handleAnswerChange(currentQuestion.id, option.text)}
                                                name={option.text}
                                                color="primary"
                                            />
                                        }
                                        label={option.text}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </FormControl>
            </Box>

            {/* Navigation Buttons */}
            <Box display="flex" width="100%" justifyContent="space-between" alignItems="center" p={2}>
                <Button variant="contained" color="primary" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                    Previous
                </Button>
                <Button variant="contained" color="secondary" onClick={handleDialogOpen} disabled={timer === 0}>
                    Submit
                </Button>
                <Button variant="contained" color="primary" onClick={handleNext} disabled={currentQuestionIndex === testDetails.questions.length - 1}>
                    Next
                </Button>
            </Box>

            {/* Submit Dialog */}
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
