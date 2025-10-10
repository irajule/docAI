import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
  Fade,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

function TranslateApp() {
  const [file, setFile] = useState(null);
  const [targetLang, setTargetLang] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const loadingIntervalRef = useRef(null);
  const loadingStartTime = useRef(null);

  const languageOptions = [
  { code: "French", label: "🇫🇷 French" },
  { code: "Spanish", label: "🇪🇸 Spanish" },
  { code: "English", label: "🇬🇧 English" },
  { code: "Italian", label: "🇮🇹 Italian" },
  { code: "Portuguese", label: "🇵🇹 Portuguese" },
];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !targetLang) {
      alert("Please upload a file and select a language.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("source_lang", "auto"); // You can add a dropdown for source_lang too
    formData.append("target_lang", targetLang);

    try {
      setLoading(true);
      setTranslation("");
      setLoadingMessage("Translating document...");
      loadingStartTime.current = Date.now();

      loadingIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - loadingStartTime.current) / 1000;
        if (elapsed > 24) setLoadingMessage("Finalizing translation...");
        else if (elapsed > 12) setLoadingMessage("Almost done...");
        else setLoadingMessage("Translating document...");
      }, 1000);
      const backendURL = process.env.REACT_APP_API_URL;
      const bp = `${backendURL}/translate`
      const res = await axios.post(bp, formData);
      setTranslation(res.data.translation || "No translation returned.");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Translation failed. Please try again.");
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
        🌐 Document Translator
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

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Target Language</InputLabel>
          <Select
            value={targetLang}
            label="Target Language"
            onChange={(e) => setTargetLang(e.target.value)}
          >
            {languageOptions.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !file || !targetLang}
          fullWidth
          size="large"
        >
          Translate
        </Button>
      </Box>

      <Fade in={Boolean(translation)}>
        <Paper elevation={3} sx={{ mt: 4, p: 3, backgroundColor: "#f9f9f9" }}>
          <Typography variant="h6" gutterBottom>
            📝 Translation:
          </Typography>
          <Typography sx={{ whiteSpace: "pre-wrap" }}>{translation}</Typography>
        </Paper>
      </Fade>

      {loading && <LoadingOverlay />}
    </Container>
  );
}

export default TranslateApp;
