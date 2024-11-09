import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, Paper, Grid, FormControl, FormControlLabel, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, RadioGroup, Radio } from '@mui/material';
import { AuthContext } from '../Auth/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Webcam from "react-webcam";

function ExamPage() {
    const webcamRef = React.useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { authToken } = useContext(AuthContext);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timer, setTimer] = useState(0);
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
    const testDetails = location.state?.testData;
    const [resultData,setResultData] = useState(null)

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
            captureFrame()
        }, 1000);

        return () => {
            clearInterval(countdown)
        };
    }, [testDetails, authToken, navigate]);

    useEffect(()=>{
        console.log("Student Monitoring result is :",resultData)
    },[resultData])
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

    const captureFrame = async () => {
        if (webcamRef.current) {
          const frameMatrix = getFrameMatrix();
          if (frameMatrix) {
            try {
              await fetch(`${config.apiUrl}process_frame`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  student_id: authToken['id'], // Add an identifier for the student
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

    const fetchEndProcess = async () => {
        try {
            const response = await fetch(`${config.apiUrl}end_process?student_id=${authToken['id']}`, {
            method: 'GET',
            });
            const data = await response.json();
            setResultData(data);
        } catch (error) {
            console.error('Error fetching end process data:', error);
        }
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prevAnswers => {
            const updatedAnswers = { ...prevAnswers };
            const isMultiChoice = testDetails.questions[currentQuestionIndex].answerType !== "single";
            
            if (isMultiChoice) {
                // Toggle selection for multi-choice
                updatedAnswers[questionId] = updatedAnswers[questionId] || [];
                if (updatedAnswers[questionId].includes(answer)) {
                    updatedAnswers[questionId] = updatedAnswers[questionId].filter(a => a !== answer);
                } else {
                    updatedAnswers[questionId].push(answer);
                }
            } else {
                // Single answer, replace value
                updatedAnswers[questionId] = answer;
            }
            return updatedAnswers;
        });
    };

    const calculateScore = () => {
        let score = 0;
        testDetails.questions.forEach(question => {
            const userAnswer = answers[question.id];
            const correctOptions = question.options.filter(option => option.isCorrect).map(option => option.text);

            if (question.answerType === "single") {
                if (userAnswer === correctOptions[0]) {
                    score++;
                }
            } else if (question.answerType === "multi") {
                if (JSON.stringify(userAnswer?.sort()) === JSON.stringify(correctOptions.sort())) {
                    score++;
                }
            }
        });
        console.log(`Student scored: ${score} out of ${testDetails.questions.length}`);
    };

    const handleSubmit = async () => {
        calculateScore();
        await fetchEndProcess();
        console.log("Submitting test with answers:", answers);
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

            <Box
            position="fixed"
            bottom={16}
            right={16}
            width={320}
            height={240}
            border="2px solid #007BFF"
            borderRadius="8px"
            overflow="hidden"
        >
            <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={320}
                height={240}
            />
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
