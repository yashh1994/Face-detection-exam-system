import React, { useState } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, Radio, IconButton, Typography, Box, Paper } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';

function QuestionTemplate() {
    const [questionText, setQuestionText] = useState('');
    const [answerType, setAnswerType] = useState('single'); // 'single' or 'multiple'
    const [options, setOptions] = useState([]);

    // Add Option Handler
    const addOption = () => {
        setOptions([...options, { text: '', isCorrect: false }]);
    };

    // Handle Option Changes
    const handleOptionChange = (index, field, value) => {
        const updatedOptions = [...options];
        updatedOptions[index][field] = value;

        // Single selection type allows only one correct answer
        if (field === 'isCorrect' && answerType === 'single') {
            updatedOptions.forEach((opt, i) => opt.isCorrect = i === index);
        }

        setOptions(updatedOptions);
    };

    return (
        <Paper elevation={4} sx={{ p: 4, width: '60%', margin: 'auto', mt: 5 }}>
            <Typography variant="h5" gutterBottom>
                Create New Question
            </Typography>

            {/* Question Input */}
            <TextField
                label="Question"
                fullWidth
                variant="outlined"
                margin="normal"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter your question here"
            />

            {/* Answer Type Selection */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Answer Type</InputLabel>
                <Select
                    value={answerType}
                    onChange={(e) => setAnswerType(e.target.value)}
                    label="Answer Type"
                >
                    <MenuItem value="single">Single Select</MenuItem>
                    <MenuItem value="multiple">Multiple Select</MenuItem>
                </Select>
            </FormControl>

            {/* Options Section */}
            <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                    Options
                </Typography>

                {options.map((option, index) => (
                    <Box key={index} display="flex" alignItems="center" gap={2} mb={1}>
                        {answerType === 'single' ? (
                            <Radio
                                checked={option.isCorrect}
                                onChange={() => handleOptionChange(index, 'isCorrect', true)}
                                color="primary"
                            />
                        ) : (
                            <Checkbox
                                checked={option.isCorrect}
                                onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                                color="primary"
                            />
                        )}
                        <TextField
                            placeholder={`Option ${index + 1}`}
                            variant="outlined"
                            value={option.text}
                            onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                            fullWidth
                        />
                    </Box>
                ))}

                <IconButton color="primary" onClick={addOption} size="large" sx={{ mt: 1 }}>
                    <AddCircleOutline fontSize="inherit" />
                </IconButton>
                <Typography variant="body2" color="textSecondary">
                    Add Option
                </Typography>
            </Box>
        </Paper>
    );
}

export default QuestionTemplate;
