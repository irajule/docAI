import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Fade,
} from "@mui/material";

function ResumeApp() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const loadingIntervalRef = useRef(null);
  const loadingStartTime = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !question) {
      alert("Please upload a file and enter a question.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", question);

    try {
      setLoading(true);
      setAnswer("");
      setLoadingMessage("Analyzing the document…");
      loadingStartTime.current = Date.now();

      // Change loading message over time
      loadingIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - loadingStartTime.current) / 1000;
        if (elapsed > 24) {
          setLoadingMessage("Preparing final answer…");
        } else if (elapsed > 12) {
          setLoadingMessage("Almost done…");
        } else {
          setLoadingMessage("Analyzing the document…");
        }
      }, 1000);
      const backendURL = process.env.REACT_APP_API_URL;
      const bp = 'http://127.0.0.1:8000/docqa'
      const res = await axios.post(bp, formData);
      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      clearInterval(loadingIntervalRef.current);
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
        bgcolor: "rgba(0, 0, 0, 0.6)",
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
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        📄 Document Q&A
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          backgroundColor: "#fff",
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mb: 1 }}
        >
          {file ? "Replace File" : "Upload a File"}
          <input
            type="file"
            hidden
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => {
              const selected = e.target.files[0];
              if (selected) setFile(selected);
            }}
          />
        </Button>

        {file && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, fontStyle: "italic" }}
          >
            📎 Selected: {file.name}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Ask a question about the uploaded document"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !file || !question.trim()}
          fullWidth
          size="large"
        >
          Ask
        </Button>
      </Box>

      <Fade in={Boolean(answer)}>
        <Paper elevation={3} sx={{ mt: 4, p: 3, backgroundColor: "#f9f9f9" }}>
          <Typography variant="h6" gutterBottom>
            🧠 Answer:
          </Typography>

          {/* Render formatted answer with sections and bullets */}
          {answer.split("\n").map((line, index) => {
            const trimmed = line.trim();

            if (trimmed.startsWith("##")) {
              return (
                <Typography
                  key={index}
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mt: 2 }}
                >
                  {trimmed.replace(/^##\s*/, "")}
                </Typography>
              );
            }

            if (trimmed.startsWith("*")) {
              return (
                <Typography key={index} component="li" sx={{ ml: 3 }}>
                  {trimmed.replace(/^\*\s*/, "")}
                </Typography>
              );
            }

            if (trimmed === "") {
              return <br key={index} />;
            }

            return (
              <Typography key={index} paragraph>
                {trimmed}
              </Typography>
            );
          })}
        </Paper>
      </Fade>

      {loading && <LoadingOverlay />}
    </Container>
  );
}

export default ResumeApp;
