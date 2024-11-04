import React, { useState ,useContext, useEffect} from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import QuestionTemplate from './Components/QuestionTemplate';
import { AddCircle } from '@mui/icons-material';
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
    const { login,authToken } = useContext(AuthContext);
    const [questions, setQuestions] = useState([]);

    useEffect(()=>{
        if (!authToken) {
            navigate('/login');
          }else{
            console.log(authToken)
          }
    },[])
    
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
                {/* Test Info */}
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h5" color="primary">Test Information</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={async () => {
                                // Validation and API call logic
                            }}
                            sx={{ fontWeight: 'bold' }}
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
                        <TextField  id="startTime" type="datetime-local" value={testInfo.startTime} onChange={handleTestInfoChange} fullWidth />
                        <TextField  id="endTime" type="datetime-local" value={testInfo.endTime} onChange={handleTestInfoChange} fullWidth />
                    </Box>
                </Paper>

                {/* Questions Section */}
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
            </Box>
        </Box>
    );
}

export default CreateTest;
