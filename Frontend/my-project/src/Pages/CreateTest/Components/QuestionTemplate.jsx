import React, { useState } from 'react';
import { TextField, Select, MenuItem, FormControl, Checkbox, Radio, IconButton, Typography, Box, Paper } from '@mui/material';
import { AddCircleOutline, Delete } from '@mui/icons-material';


function QuestionTemplate({ questionData, onUpdate, onRemove }) {
    const [questionText, setQuestionText] = useState(questionData.questionText);
    const [answerType, setAnswerType] = useState(questionData.answerType);
    const [options, setOptions] = useState(questionData.options);

    // Add Option Handler
    const addOption = () => {
        const newOptions = [...options, { text: '', isCorrect: false }];
        setOptions(newOptions);
        onUpdate({ ...questionData, options: newOptions });
    };

    // Handle Option Changes
    const handleOptionChange = (index, field, value) => {
        const updatedOptions = [...options];
        updatedOptions[index][field] = value;

        // If single selection type, only one option can be correct
        if (field === 'isCorrect' && answerType === 'single') {
            updatedOptions.forEach((opt, i) => (opt.isCorrect = i === index));
        }

        setOptions(updatedOptions);
        onUpdate({ ...questionData, options: updatedOptions });
    };

    return (
        <Paper elevation={4} sx={{ p: 3, width: '100%', margin: 'auto', mt: 4, position: 'relative' }}>
            {/* Delete Icon at Top-Right */}
            <IconButton onClick={onRemove} size="small" color="error" sx={{ position: 'absolute', top: 8, right: 8 }}>
                <Delete />
            </IconButton>

            <Typography variant="h6" gutterBottom>
                Create New Question
            </Typography>

            {/* Question Input */}
            <TextField
                label="Question"
                fullWidth
                variant="outlined"
                margin="dense"
                value={questionText}
                onChange={(e) => {
                    setQuestionText(e.target.value);
                    onUpdate({ ...questionData, questionText: e.target.value });
                }}
                placeholder="Enter your question here"
                sx={{ mb: 2 }}
            />

            {/* Answer Type Selection */}
            <FormControl fullWidth margin="dense">
                <Select
                    value={answerType}
                    onChange={(e) => {
                        setAnswerType(e.target.value);
                        onUpdate({ ...questionData, answerType: e.target.value });
                    }}
                    label="Answer Type"
                >
                    <MenuItem value="single">Single Select</MenuItem>
                    <MenuItem value="multiple">Multiple Select</MenuItem>
                </Select>
            </FormControl>

            {/* Options Section */}
            <Box mt={2}>
                <Typography variant="subtitle1" gutterBottom>
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
                            size="small"
                            fullWidth
                        />
                    </Box>
                ))}

                {/* Add Option Button */}
                <Box display="flex" alignItems="center" mt={1}>
                    <IconButton color="primary" onClick={addOption} size="large">
                        <AddCircleOutline fontSize="inherit" />
                    </IconButton>
                    <Typography variant="body2" color="textSecondary" ml={1}>
                        Add Option
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
}

export default QuestionTemplate;
