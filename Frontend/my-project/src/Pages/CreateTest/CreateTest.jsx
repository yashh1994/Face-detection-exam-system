import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, duration } from '@mui/material';
import QuestionTemplate from './Components/QuestionTemplate';
import { AddCircle } from '@mui/icons-material';
import { stringify } from 'postcss';
import axios from 'axios'
import config from '../../config';


function CreateTest() {
    const [testInfo, setTestInfo] = useState({
        title: '',
        duration: '',
        description: '',
        startTime: '',
        endTime: '',
    });
    const [questions, setQuestions] = useState([]);

    // Handler to update test info fields
    const handleTestInfoChange = (e) => {
        setTestInfo({ ...testInfo, [e.target.id]: e.target.value });
    };

    // Handler to add a new question
    const addQuestion = () => {
        setQuestions([
            ...questions,
            { id: Date.now(), questionText: '', answerType: 'single', options: [] }
        ]);
    };

    // Handler to update a specific question
    const updateQuestion = (id, updatedQuestion) => {
        setQuestions(questions.map(q => (q.id === id ? updatedQuestion : q)));
    };

    // Handler to remove a question by ID
    const removeQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    return (
        <Box className="w-screen h-screen bg-blue-950 flex justify-center items-start p-4 overflow-y-auto">
            <Box sx={{ width: '70%', display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* General Test Information */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        backgroundColor: 'white',
                    }}
                >
                    <div className='flex flex-row mb-8'>
                        <Typography variant="h5" color="primary" gutterBottom>
                            Test Information
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={ async () => {
                                if (!testInfo.title || !testInfo.duration || !testInfo.description || !testInfo.startTime || !testInfo.endTime) {
                                    alert("Please fill in all the test details.");
                                    return;
                                }
                                
                                let test = {
                                    "title": String(testInfo['title']),
                                    "duration": String(testInfo['duration']),
                                    "description": String(testInfo['description']),
                                    "start_time": String(testInfo['startTime']),
                                    "end_time": String(testInfo['endTime']),
                                    "user_id": "8"
                                };
                                // Validate questions
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
                                test['questions'] = questions

                                // Proceed with test creation
                                try {
                                    const response = await axios.post(`${config.apiUrl}/add-test/${test.user_id}`, test);
                                    console.log(`Test created successfully! Open link: ${response.data.open_link}`);
                                } catch (error) {
                                    // Display appropriate error message
                                    console.log(error || "An error occurred during test creation.");
                                }
                            }}
                            sx={{
                                marginLeft: 'auto',
                                fontWeight: 'bold',
                                height: 'fit-content'
                            }}
                        >
                            Create Test
                        </Button>
                    </div>

                    <Box display="flex" gap={2} mb={4}>
                        <TextField
                            label="Name"
                            id="title"
                            value={testInfo.title}
                            onChange={handleTestInfoChange}
                            fullWidth
                            variant="outlined"
                            placeholder="Enter test name"
                        />
                        <TextField
                            label="Duration"
                            id="duration"
                            type='number'
                            value={testInfo.duration}
                            onChange={handleTestInfoChange}
                            fullWidth
                            variant="outlined"
                            placeholder="In minutes(ex.  10, 30)"
                        />
                    </Box>
                    <TextField
                        label="Description"
                        id="description"
                        value={testInfo.description}
                        onChange={handleTestInfoChange}
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        placeholder="Enter test description"
                        sx={{ mb: 3 }}
                    />
                    <Box display="flex" gap={2} mb={4}>
                        <TextField
                            label="Valid Start Time"
                            id="startTime"
                            type="datetime-local"
                            value={testInfo.startTime}
                            onChange={handleTestInfoChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Valid End Time"
                            id="endTime"
                            type="datetime-local"
                            value={testInfo.endTime}
                            onChange={handleTestInfoChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </Paper>

                {/* Questions Section */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        backgroundColor: 'white',
                    }}
                    className='mb-12'
                >
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
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircle />}
                            onClick={addQuestion}
                            sx={{
                                width: '100%',
                                maxWidth: '300px',
                                borderRadius: 2,
                                fontWeight: 'bold'
                            }}
                        >
                            Add Question
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default CreateTest;
