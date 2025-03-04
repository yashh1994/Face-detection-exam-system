import React, { useState, useContext, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, Paper, Dialog,
    DialogTitle, DialogContent, DialogActions, IconButton,
    Tooltip, Divider, Grid
} from '@mui/material';
import QuestionTemplate from './Components/QuestionTemplate';
import { AddCircle, ContentCopy } from '@mui/icons-material';
import axios from 'axios';
import config from '../config';
import { AuthContext } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import mammoth from 'mammoth';
function CreateTest() {
    const [testInfo, setTestInfo] = useState({
        title: '',
        duration: '',
        description: '',
        startTime: '',
        endTime: '',
    });
    const navigate = useNavigate();
    const { authToken } = useContext(AuthContext);
    const [questions, setQuestions] = useState([]);
    const [openLink, setOpenLink] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (!authToken) {
            navigate('/login');
        }
    }, [authToken, navigate]);
    

    const handleTestInfoChange = (e) => {
        setTestInfo({ ...testInfo, [e.target.id]: e.target.value });
    };


    const addQuestion = () => {
        setQuestions([
            ...questions,
            { id: Date.now(), questionText: '', answerType: 'single', options: [] }
        ]);
    };


    const updateQuestion = (id, updatedQuestion) => {
        setQuestions(questions.map(q => (q.id === id ? updatedQuestion : q)));
    };


    const removeQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
    };


    const handleSubmit = async () => {
        if (!testInfo.title || !testInfo.duration || !testInfo.description || !testInfo.startTime || !testInfo.endTime) {
            alert("Please fill in all the test details.");
            return;
        }

        const startTime = new Date(testInfo.startTime);
        const endTime = new Date(testInfo.endTime);

        if (startTime >= endTime) {
            alert("Start time must be before end time.");
            return;
        }

        for (let question of questions) {
            if (!question.questionText) {
                alert("Please fill in all the question texts.");
                return;
            }
            if (question.options.length === 0) {
                alert("Please add options to all questions.");
                return;
            }
            const hasCorrectAnswer = question.options.some(option => option.isCorrect);
            if (!hasCorrectAnswer) {
                alert("Please mark at least one option as the correct answer for each question.");
                return;
            }
        }

        const test = {
            title: testInfo.title,
            duration: testInfo.duration,
            description: testInfo.description,
            start_time: testInfo.startTime,
            end_time: testInfo.endTime,
            user_id: authToken['id'],
            questions: questions,
        };

        try {
            const response = await axios.post(`${config.apiUrl}/add-test/${test.user_id}`, test, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });
            setOpenLink(response.data.open_link);
            navigate('/');
        } catch (error) {
            console.error("An error occurred during test creation:", error);
        }
    };


    const handleCopyLink = () => {
        navigator.clipboard.writeText(openLink);
        alert("Link copied to clipboard!");
    };


    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target.result;

            try {
                const extractedText = await mammoth.extractRawText({ arrayBuffer });
                console.log("Extracted Text: ",extractedText);
            } catch (error) {
                console.error("Error extracting text:", error);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const handleUploadDoc = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.doc,.docx';
        input.onchange = handleFileUpload;
        input.click();
    };


    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                px: 4,
                py: 6,
                backgroundColor: '#1c1c1c',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '900px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    overflowY: 'auto',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2, backgroundColor: '#2d2d2d' }}>
                    <Box display="flex" justifyContent="space-between" mb={3}>
                        <Typography variant="h5" color="primary">Test Information</Typography>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUploadDoc}
                                sx={{ marginRight: '10px', fontWeight: 'bold', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
                            >
                                Upload Doc
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
                            >
                                Create Test
                            </Button>
                        </div>
                    </Box>
                    <Box display="flex" gap={2} mb={3}>
                        <TextField
                            label="Name"
                            id="title"
                            InputLabelProps={{ style: { color: 'white' } }}
                            value={testInfo.title}
                            onChange={handleTestInfoChange}
                            fullWidth
                            sx={{
                                input: {
                                    color: 'white',
                                    backgroundColor: '#333',
                                    borderRadius: '5px',
                                    '&::placeholder': { color: '#aaa' },
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#444' },
                                    '&:hover fieldset': { borderColor: '#555' },
                                }
                            }}
                        />
                        <TextField
                            label="Duration"
                            id="duration"
                            type="number"
                            InputLabelProps={{ style: { color: 'white' } }}
                            className='text-white'
                            value={testInfo.duration}
                            onChange={handleTestInfoChange}
                            fullWidth
                            sx={{
                                input: {
                                    color: 'white',
                                    backgroundColor: '#333',
                                    borderRadius: '5px',
                                    '&::placeholder': { color: '#aaa' },
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#444' },
                                    '&:hover fieldset': { borderColor: '#555' },
                                }
                            }}
                        />
                    </Box>
                    <TextField
                        InputLabelProps={{ style: { color: 'white' } }}
                        inputProps={{ style: { color: 'white' } }}
                        label="Description"
                        id="description"
                        value={testInfo.description}
                        onChange={handleTestInfoChange}
                        fullWidth
                        multiline
                        rows={3}
                        sx={{
                            mb: 3,
                            input: {
                                color: 'white',
                                backgroundColor: '#333',
                                borderRadius: '5px',
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#444' },
                                '&:hover fieldset': { borderColor: '#555' },
                            }
                        }}
                    />
                    <Box display="flex" justifyContent="space-between" gap={4} alignItems="center">
                        <Box display="flex" gap={2} alignItems="center" flex={1}>
                            <Typography variant="body1" color="white" sx={{ minWidth: '120px' }}>Valid Start Time:</Typography>
                            <TextField
                                id="startTime"
                                type="datetime-local"
                                value={testInfo.startTime}
                                onChange={handleTestInfoChange}
                                fullWidth
                                sx={{
                                    input: {
                                        color: 'white',
                                        backgroundColor: '#333',
                                        borderRadius: '5px',
                                        '&::placeholder': { color: '#aaa' },
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#444' },
                                        '&:hover fieldset': { borderColor: '#555' },
                                    }
                                }}
                            />
                        </Box>

                        <Box display="flex" gap={2} alignItems="center" flex={1}>
                            <Typography variant="body1" color="white" sx={{ minWidth: '120px' }}>Valid End Time:</Typography>
                            <TextField
                                id="endTime"
                                type="datetime-local"
                                value={testInfo.endTime}
                                onChange={handleTestInfoChange}
                                fullWidth
                                sx={{
                                    input: {
                                        color: 'white',
                                        backgroundColor: '#333',
                                        borderRadius: '5px',
                                        '&::placeholder': { color: '#aaa' },
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#444' },
                                        '&:hover fieldset': { borderColor: '#555' },
                                    }
                                }}
                            />
                        </Box>
                    </Box>

                </Paper>

                <Paper elevation={3} sx={{ p: 4, borderRadius: 2, backgroundColor: '#2d2d2d' }}>
                    <Typography variant="h5" color="primary" gutterBottom>
                        Questions
                    </Typography>
                    {questions.map((question, index) => (
                        <QuestionTemplate
                            key={question.id}
                            questionData={question}
                            number={index + 1}
                            onUpdate={(updatedQuestion) => updateQuestion(question.id, updatedQuestion)}
                            onRemove={() => removeQuestion(question.id)}
                        />
                    ))}
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircle />}
                            onClick={addQuestion}
                            sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
                        >
                            Add Question
                        </Button>
                    </Box>
                </Paper>

                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white' }}>Test Created Successfully!</DialogTitle>
                    <DialogContent sx={{ backgroundColor: '#2d2d2d', color: 'white' }}>
                        <Typography>Your test has been created. Here’s the open link:</Typography>
                        <Box display="flex" alignItems="center" mt={2}>
                            <TextField
                                value={openLink}
                                InputProps={{ readOnly: true, sx: { backgroundColor: '#333', color: 'white' } }}
                                fullWidth
                            />
                            <Tooltip title="Copy Link">
                                <IconButton onClick={handleCopyLink} sx={{ color: 'white' }}>
                                    <ContentCopy />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ backgroundColor: '#2d2d2d' }}>
                        <Button onClick={() => setDialogOpen(false)} sx={{ color: '#1976d2' }}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );

}

export default CreateTest;
