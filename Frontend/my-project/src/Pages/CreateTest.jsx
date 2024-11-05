import React, { useState, useContext, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip } from '@mui/material';
import QuestionTemplate from './Components/QuestionTemplate';
import { AddCircle, ContentCopy } from '@mui/icons-material';
import axios from 'axios';
import config from '../config';
import { AuthContext } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

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
            setDialogOpen(true);
        } catch (error) {
            console.error("An error occurred during test creation:", error);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(openLink);
        alert("Link copied to clipboard!");
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            p: 4,
            backgroundColor: '#f5f5f5',
            overflow: 'hidden'
        }}>
            <Box sx={{ 
                width: '100%', 
                maxWidth: '70%', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 3, 
                overflowY: 'auto', 
                height: 'calc(100vh - 80px)' 
            }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h5" color="primary">Test Information</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{
                                marginLeft: 'auto',
                                fontWeight: 'bold',
                                height: 'fit-content'
                            }}
                        >
                            Create Test
                        </Button>
                    </Box>
                    <Box display="flex" gap={2} mb={4}>
                        <TextField label="Name" id="title" value={testInfo.title} onChange={handleTestInfoChange} fullWidth />
                        <TextField label="Duration" id="duration" type="number" value={testInfo.duration} onChange={handleTestInfoChange} fullWidth />
                    </Box>
                    <TextField label="Description" id="description" value={testInfo.description} onChange={handleTestInfoChange} fullWidth multiline rows={3} sx={{ mb: 3 }} />
                    <Box display="flex" gap={2} mb={4}>
                        <TextField id="startTime" type="datetime-local" value={testInfo.startTime} onChange={handleTestInfoChange} fullWidth />
                        <TextField id="endTime" type="datetime-local" value={testInfo.endTime} onChange={handleTestInfoChange} fullWidth />
                    </Box>
                </Paper>

                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h5" color="primary" gutterBottom>Questions</Typography>
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
                        <Button variant="contained" color="primary" startIcon={<AddCircle />} onClick={addQuestion} sx={{ fontWeight: 'bold' }}>Add Question</Button>
                    </Box>
                </Paper>

                {/* Success Dialog with Open Link */}
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle>Test Created Successfully!</DialogTitle>
                    <DialogContent>
                        <Typography>Your test has been created. Here’s the open link:</Typography>
                        <Box display="flex" alignItems="center" mt={2}>
                            <TextField
                                value={openLink}
                                InputProps={{ readOnly: true }}
                                variant="outlined"
                                fullWidth
                                sx={{ mr: 1 }}
                            />
                            <Tooltip title="Copy Link">
                                <IconButton onClick={handleCopyLink} color="primary">
                                    <ContentCopy />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">Close</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

export default CreateTest;
