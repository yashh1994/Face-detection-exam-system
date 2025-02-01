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
    setTestToDelete(test); // Set the test to delete
    setDeleteDialogOpen(true); // Open confirmation dialog
  };

  return (
    <Box sx={{ padding: 4, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" sx={{ color: "#000000", fontWeight: "bold", mb: 4 }}>
          Analysis Page
        </Typography>

        <input
          type="text"
          id="name"
          name="name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-8 w-full px-4 py-4 rounded-lg bg-white text-black border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Search tests by title"
          required
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            {filteredTests.length === 0 ? (
              <Typography
                variant="h6"
                align="center"
                sx={{
                  color: "#757575",
                  fontStyle: "italic",
                  fontWeight: "bold",
                  marginTop: 5,
                }}
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
                        background: "#ffffff",
                        borderRadius: "12px",
                        position: "relative",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
                        },
                        borderLeft: `8px solid #42a5f5`,
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ color: "#42a5f5" }} gutterBottom>
                          {test.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#757575", mb: 1 }}>
                          {test.description}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#757575" }}>
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
                color="primary"
                sx={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  borderRadius: "20px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
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
