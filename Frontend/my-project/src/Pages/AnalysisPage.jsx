import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Delete } from "@mui/icons-material";
import config from "../config";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Dialog,
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../Auth/AuthContext";

const AnalysisPage = () => {
  const [tests, setTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    } else {
      fetchTests();
    }
  }, [authToken, navigate]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.apiUrl}/get-my-test/${authToken.id}`);
      setTests(response.data);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = tests.filter((test) =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (test) => {
    navigate(`/analysis/${test.open_link}`);
  };

  const handleDeleteTest = (test) => {
    console.log("Delete test:", test);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Analysis Dashboard
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search tests by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginBottom: 3, backgroundColor: "white", borderRadius: "8px" }}
        />
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {filteredTests.length === 0 ? (
              <Typography
                variant="h6"
                align="center"
                sx={{ color: "#757575", fontStyle: "italic" }}
              >
                No tests available. Start creating one!
              </Typography>
            ) : (
              <Grid container spacing={4}>
                {filteredTests.map((test) => (
                  <Grid item xs={12} sm={6} md={4} key={test.id}>
                    <Card
                      onClick={() => handleCardClick(test)}
                      sx={{
                        background: "white",
                        borderRadius: "12px",
                        position: "relative",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        cursor: "pointer",
                        "&:hover": { transform: "scale(1.05)", boxShadow: "0 6px 16px rgba(0,0,0,0.2)" },
                      }}
                    >
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTest(test);
                        }}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "#d32f2f",
                          "&:hover": { color: "#b71c1c" },
                        }}
                      >
                        <Delete />
                      </IconButton>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ color: "#1a237e" }}>
                          {test.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {test.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Duration: {test.duration} minutes
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  borderRadius: "30px",
                  px: 4,
                  py: 1.5,
                  background: "linear-gradient(90deg, #42a5f5, #1e88e5)",
                  color: "white",
                  fontWeight: "bold",
                  boxShadow: 3,
                  "&:hover": {
                    background: "linear-gradient(90deg, #1976d2, #1565c0)",
                    boxShadow: 6,
                  },
                }}
                onClick={() => navigate("/create-test")}
              >
                Create Test
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default AnalysisPage;
