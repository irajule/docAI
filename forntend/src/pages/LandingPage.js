import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 12 }}>
      <Typography variant="h3" gutterBottom>
        🧠 Document AI Assistant
      </Typography>
      <Typography variant="h6" color="text.secondary">
        Ask any document  from resumes to contracts. Intelligent answers powered by AI.
      </Typography>
      <Box mt={5}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/docqa"
        >
          Start
        </Button>
      </Box>
    </Container>
  );
}

export default LandingPage;
