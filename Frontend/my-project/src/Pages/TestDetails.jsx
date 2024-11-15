import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import config from "../config";
import { AuthContext } from "../Auth/AuthContext";

const TestDetailsPage = () => {
  const { open_link } = useParams();
  const [testDetails, setTestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(open_link)
    if (!authToken) {
      navigate("/login");
    } else {
      fetchTestDetails();
    }
  }, [authToken, navigate]);

  const fetchTestDetails = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/get-test/${open_link}`);
      setTestDetails(response.data);
    } catch (error) {
      console.error("Error fetching test details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!testDetails) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4, color: "#757575" }}>
        Test details not found.
      </Typography>
    );
  }

  const { title, description, duration, start_time, end_time, questions } = testDetails;

  return (
    <Box sx={{ padding: 4 }}>
      {/* Test Details Section */}
      <Typography variant="h4" gutterBottom>
        Test Details
      </Typography>
      <Card sx={{ marginBottom: 4, padding: 3, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {description}
        </Typography>
        <Divider sx={{ marginY: 2 }} />
        <Typography variant="body2">
          <strong>Duration:</strong> {duration} minutes
        </Typography>
        <Typography variant="body2">
          <strong>Start Time:</strong> {new Date(start_time).toLocaleString()}
        </Typography>
        <Typography variant="body2">
          <strong>End Time:</strong> {new Date(end_time).toLocaleString()}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          <strong>Questions:</strong>
        </Typography>
        {questions.map((question, index) => (
          <Box key={question.id} sx={{ marginY: 2 }}>
            <Typography variant="subtitle1">
              {index + 1}. {question.questionText}
            </Typography>
            {question.options.map((option, idx) => (
              <Typography
                key={idx}
                variant="body2"
                sx={{ color: option.isCorrect ? "green" : "inherit" }}
              >
                {option.text} {option.isCorrect ? "(Correct)" : ""}
              </Typography>
            ))}
          </Box>
        ))}
      </Card>

      {/* Student Details Section */}
      <Typography variant="h4" gutterBottom>
        Students & Scores
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Student Name</strong></TableCell>
              <TableCell><strong>Score</strong></TableCell>
              <TableCell><strong>Start Time</strong></TableCell>
              <TableCell><strong>Monitoring Data</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {testDetails.students.map((student) => (
              <TableRow key={student.user_id}>
                <TableCell>{student.name || "Unknown"}</TableCell>
                <TableCell>{student.score}</TableCell>
                <TableCell>{new Date(student.start_time).toLocaleString()}</TableCell>
                <TableCell>
                  {student.monitoring_data
                    ? student.monitoring_data.description
                    : "No Data"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TestDetailsPage;
