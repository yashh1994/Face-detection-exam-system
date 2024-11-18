import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  Radio,
  IconButton,
  Typography,
  Box,
  Paper,
  Tooltip,
} from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";

function QuestionTemplate({ questionData, number, onUpdate, onRemove }) {
  const [questionText, setQuestionText] = useState(questionData.questionText);
  const [answerType, setAnswerType] = useState(questionData.answerType);
  const [options, setOptions] = useState(questionData.options);

  // Add Option Handler
  const addOption = () => {
    const newOptions = [...options, { text: "", isCorrect: false }];
    setOptions(newOptions);
    onUpdate({ ...questionData, options: newOptions });
  };

  // Remove Option Handler
  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    onUpdate({ ...questionData, options: newOptions });
  };

  // Handle Option Changes
  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...options];
    updatedOptions[index][field] = value;

    // If single selection type, only one option can be correct
    if (field === "isCorrect" && answerType === "single") {
      updatedOptions.forEach((opt, i) => (opt.isCorrect = i === index));
    }

    setOptions(updatedOptions);
    onUpdate({ ...questionData, options: updatedOptions });
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        width: "100%",
        margin: "auto",
        mt: 4,
        bgcolor: "grey.900",
        color: "white",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.1)",
        position: "relative",
      }}
    >
      {/* Question Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="span" sx={{ color: "cyan" }}>
          {"Question " + number}
        </Typography>
        <Tooltip title="Remove Question" placement="top" arrow>
          <IconButton onClick={onRemove} size="small" sx={{ color: "error.main" }}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Question Text */}
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
        InputLabelProps={{
          style: { color: "white" },
        }}
        InputProps={{
          style: { color: "white", backgroundColor: "rgba(255,255,255,0.1)" },
        }}
        sx={{ mb: 3 }}
      />

      {/* Answer Type Selection */}
      <FormControl fullWidth margin="dense">
        <Select
          value={answerType}
          onChange={(e) => {
            setAnswerType(e.target.value);
            onUpdate({ ...questionData, answerType: e.target.value });
          }}
          sx={{
            bgcolor: "rgba(255,255,255,0.1)",
            color: "white",
            ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.5)" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "cyan" },
            ".MuiSvgIcon-root": { color: "white" },
          }}
        >
          <MenuItem value="single">Single Select</MenuItem>
          <MenuItem value="multiple">Multiple Select</MenuItem>
        </Select>
      </FormControl>

      {/* Options Section */}
      <Box mt={3}>
        <Typography variant="subtitle1" gutterBottom sx={{ color: "cyan" }}>
          Options
        </Typography>

        {options.map((option, index) => (
          <Box key={index} display="flex" alignItems="center" gap={2} mb={2}>
            {answerType === "single" ? (
              <Radio
                checked={option.isCorrect}
                onChange={() => handleOptionChange(index, "isCorrect", true)}
                sx={{ color: "cyan" }}
              />
            ) : (
              <Checkbox
                checked={option.isCorrect}
                onChange={(e) => handleOptionChange(index, "isCorrect", e.target.checked)}
                sx={{ color: "cyan" }}
              />
            )}
            <TextField
              placeholder={`Option ${index + 1}`}
              variant="outlined"
              value={option.text}
              onChange={(e) => handleOptionChange(index, "text", e.target.value)}
              size="small"
              fullWidth
              InputProps={{
                style: { color: "white", backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            />
            <Tooltip title="Remove Option" placement="top" arrow>
              <IconButton onClick={() => removeOption(index)} size="small" sx={{ color: "error.main" }}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        ))}

        {/* Add Option Button */}
        <Box display="flex" alignItems="center" mt={2}>
          <Tooltip title="Add Option" placement="top" arrow>
            <IconButton color="primary" onClick={addOption} size="large">
              <AddCircleOutline sx={{ fontSize: 30, color: "cyan" }} />
            </IconButton>
          </Tooltip>
          <Typography variant="body2" color="textSecondary" ml={1} sx={{ color: "white" }}>
            Add Option
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default QuestionTemplate;
