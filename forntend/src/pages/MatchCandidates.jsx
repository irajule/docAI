import React, { useState, useRef } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid,
  Collapse,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import axios from "axios";

const extractScore = (text) => {
  const match = text.match(/Score:\s*(\d{1,3})/);
  return match ? parseInt(match[1], 10) : 0;
};

const MatchCandidates = () => {
  const [files, setFiles] = useState([]);
  const [jobDesc, setJobDesc] = useState("");
  const [fitYes, setFitYes] = useState([]);
  const [fitNo, setFitNo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Analyzing the documents…");
  const [expandedIdxYes, setExpandedIdxYes] = useState(null);
  const [expandedIdxNo, setExpandedIdxNo] = useState(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => {
      const combined = [...prev, ...newFiles];
      const unique = Array.from(new Map(combined.map((f) => [f.name, f])).values());
      return unique;
    });
  };

  const handleRemoveFile = (fileName) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const categorizeResults = (rawResults) => {
    const yes = [];
    const no = [];

    rawResults.forEach((r) => {
      const match = r.match || "";
      const score = extractScore(match);
      const newResult = { ...r, score };

      if (score >= 60) {
        yes.push(newResult);
      } else {
        no.push(newResult);
      }
    });

    yes.sort((a, b) => b.score - a.score);
    no.sort((a, b) => b.score - a.score);

    setFitYes(yes);
    setFitNo(no);
  };

  const handleUpload = async () => {
    if (!files.length || !jobDesc) {
      alert("Upload at least one resume and provide a job description.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("job_description", jobDesc);

    try {
      setLoading(true);
      setLoadingMessage("Analyzing the documents…");
      setFitYes([]);
      setFitNo([]);
      setExpandedIdxYes(null);
      setExpandedIdxNo(null);

      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        if (elapsed >= 24) {
          setLoadingMessage("Preparing the answers…");
        } else if (elapsed >= 12) {
          setLoadingMessage("Almost done 🤖");
        } else {
          setLoadingMessage("Analyzing the documents…");
        }
      }, 1000);
      const backendURL = process.env.REACT_APP_API_URL;
      const bp = `${backendURL}/cvscreen`
      const res = await axios.post(bp, formData);
      categorizeResults(res.data.results);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      clearInterval(timerRef.current);
      setLoading(false);
    }
  };

  const LoadingOverlay = () => (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0, 0, 0, 0.7)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
      }}
    >
      <CircularProgress size={64} thickness={5} sx={{ mb: 3 }} />
      <Typography variant="h6" sx={{ textAlign: "center", maxWidth: "80%" }}>
        {loadingMessage}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        🎯 Match Candidates to a Job Requirements
      </Typography>

      <Box sx={{ display: "flex", gap: 4, mt: 4, alignItems: "flex-start" }}>
        {/* Left Side */}
        <Box sx={{ flex: 1, minWidth: 0, position: "sticky", top: 80 }}>
          <Button variant="outlined" component="label" sx={{ my: 2 }}>
            Upload CVs
            <input
              type="file"
              hidden
              accept=".pdf,.doc,.docx,.txt"
              multiple
              onChange={handleFileChange}
            />
          </Button>

          {files.length > 0 && (
            <Paper sx={{ mb: 2, p: 2, backgroundColor: "#f5f5f5" }}>
              <Typography variant="subtitle1" gutterBottom>
                {files.length} file(s) selected:
              </Typography>
              <List dense>
                {files.map((file, idx) => (
                  <ListItem
                    key={idx}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleRemoveFile(file.name)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={file.name} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          <TextField
            fullWidth
            multiline
            minRows={6}
            label="Type or paste job requirements"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            variant="outlined"
          />
          
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleUpload}
             disabled={loading || files.length === 0 || jobDesc.trim() === ""}
          >
            {loading ? <CircularProgress size={24} /> : "Assess Candidates"}
          </Button>
          
        </Box>

        {/* Right Side */}
        <Box sx={{ flex: 1, minWidth: 0, maxHeight: "80vh", overflowY: "auto" }}>
          {(fitYes.length > 0 || fitNo.length > 0) && (
            <>
              {fitYes.length > 0 && (
                <Paper sx={{ p: 2, bgcolor: "#e8f5e9", mb: 2 }}>
                  <Typography variant="h6" gutterBottom>✅ Meets Requirements: Yes</Typography>
                  <List>
                    {fitYes.map((r, idx) => (
                      <React.Fragment key={idx}>
                        <ListItem alignItems="flex-start" sx={{ flexDirection: "column", alignItems: "stretch" }}>
                          <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                              <Typography variant="subtitle1" fontWeight="bold">{r.filename}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Score: {r.score}%
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Button
                                size="small"
                                endIcon={expandedIdxYes === idx ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                onClick={() => setExpandedIdxYes(expandedIdxYes === idx ? null : idx)}
                              >
                                {expandedIdxYes === idx ? "Hide Details" : "View Details"}
                              </Button>
                            </Grid>
                          </Grid>
                          <Collapse in={expandedIdxYes === idx} timeout="auto" unmountOnExit>
                            <Paper variant="outlined" sx={{ mt: 1, p: 1, whiteSpace: "pre-line", fontFamily: "monospace", fontSize: 14, backgroundColor: "#f0f7f0" }}>
                              {r.match}
                            </Paper>
                          </Collapse>
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              )}

              {fitNo.length > 0 && (
                <Paper sx={{ p: 2, bgcolor: "#ffebee" }}>
                  <Typography variant="h6" gutterBottom>❌ Meets Requirements: No</Typography>
                  <List>
                    {fitNo.map((r, idx) => (
                      <React.Fragment key={idx}>
                        <ListItem alignItems="flex-start" sx={{ flexDirection: "column", alignItems: "stretch" }}>
                          <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                              <Typography variant="subtitle1" fontWeight="bold">{r.filename}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Score: {r.score}%
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Button
                                size="small"
                                endIcon={expandedIdxNo === idx ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                onClick={() => setExpandedIdxNo(expandedIdxNo === idx ? null : idx)}
                              >
                                {expandedIdxNo === idx ? "Hide Details" : "View Details"}
                              </Button>
                            </Grid>
                          </Grid>
                          <Collapse in={expandedIdxNo === idx} timeout="auto" unmountOnExit>
                            <Paper variant="outlined" sx={{ mt: 1, p: 1, whiteSpace: "pre-line", fontFamily: "monospace", fontSize: 14, backgroundColor: "#f9e6e6" }}>
                              {r.match}
                            </Paper>
                          </Collapse>
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              )}
            </>
          )}
        </Box>
      </Box>

      {loading && <LoadingOverlay />}
    </Container>
  );
};

export default MatchCandidates;
