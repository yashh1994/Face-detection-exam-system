import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";
import axios from "axios";
import config from "../config";
import { AuthContext } from "../Auth/AuthContext";

const TestDetailsPage = () => {
  const { open_link } = useParams();
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    } else {
      fetchExamData();
    }
  }, [authToken, navigate]);

  const fetchExamData = async () => {
    console.log(open_link)
    try {
      const response = await axios.get(`${config.apiUrl}/get-exam-data/${open_link}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setExamData(response.data);
    } catch (error) {
      console.error("Error fetching exam data:", error);
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

  if (!examData) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4, color: "#757575" }}>
        Exam data not found.
      </Typography>
    );
  }

  const { test_details, students } = examData;

  return (
    <Box sx={{ padding: 4, backgroundColor: "#F4F6F8" }}>
      {/* Test Details Section */}
      <Typography variant="h4" gutterBottom sx={{ color: "#2C3E50", fontWeight: "bold" }}>
        Exam Analysis
      </Typography>
      <Card sx={{ marginBottom: 4, padding: 3, boxShadow: 3, backgroundColor: "#ECF0F1" }}>
        <Typography variant="h5" gutterBottom sx={{ color: "#1ABC9C", fontWeight: "bold" }}>
          {test_details.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {test_details.description}
        </Typography>
        <Divider sx={{ marginY: 2, borderColor: "#1ABC9C" }} />
        <Typography variant="body2">
          <strong>Duration:</strong> {test_details.duration} minutes
        </Typography>
        <Typography variant="body2">
          <strong>Start Time:</strong> {new Date(test_details.start_time).toLocaleString()}
        </Typography>
        <Typography variant="body2">
          <strong>End Time:</strong> {new Date(test_details.end_time).toLocaleString()}
        </Typography>
      </Card>

      {/* Students Monitoring Data Table */}
      <Typography variant="h4" gutterBottom sx={{ color: "#2C3E50", fontWeight: "bold" }}>
        Students & Monitoring Data
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 3, mt: 2, backgroundColor: "#FFFFFF" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#2980B9" }}>
            <TableRow>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>Student Name</TableCell>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>Score</TableCell>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>Session Duration</TableCell>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>Eyes Closed Ratio</TableCell>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>Eyes Open Ratio</TableCell>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>Face Detected Ratio</TableCell>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>Multi-Face Detection Time</TableCell>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>No Face Detected Ratio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.student_details.id}>
                <TableCell>{student.student_details.name}</TableCell>
                <TableCell>{student.student_details.email}</TableCell>
                <TableCell>{student.score}</TableCell>
                <TableCell>{student.monitoring_data["Session Duration"]}</TableCell>
                <TableCell>{student.monitoring_data["Eyes Closed Ratio"]}</TableCell>
                <TableCell>{student.monitoring_data["Eyes Open Ratio"]}</TableCell>
                <TableCell>{student.monitoring_data["Face Detected Ratio"]}</TableCell>
                <TableCell>{student.monitoring_data["Multi-Face Detection Time"]}</TableCell>
                <TableCell>{student.monitoring_data["No Face Detected Ratio"]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TestDetailsPage;
