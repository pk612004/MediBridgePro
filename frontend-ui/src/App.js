import React, { useState } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Slide,
  Fade,
  Grid,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";
import Lottie from "lottie-react";
import uploadAnim from "./assets/upload.json";
import processingAnim from "./assets/processing.json";
import illustration from "./assets/illustration.png"; // ✅ Medical Illustration
import "./App.css"; // ✅ Make sure this has quote and layout styling

const Input = styled("input")({
  display: "none",
});

function App() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setSummary("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://medibridge-backend-l8cf.onrender.com/upload_pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      setSummary("❌ Error: Could not connect to backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      {/* 💬 Floating Motivational Quotes */}
      <div className="quote-container">
        <div className="quote quote-1">🌟 You're stronger than your diagnosis!</div>
        <div className="quote quote-2">💖 Healing begins with hope.</div>
        <div className="quote quote-3">🧘‍♀️ Take a deep breath. You're not alone.</div>
      </div>

      <Paper
        elevation={3}
        sx={{
          p: 5,
          borderRadius: 4,
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          zIndex: 1,
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* 📷 Left Illustration */}
          <Grid item xs={12} md={5}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <img
                src={illustration}
                alt="medical-illustration"
                style={{ width: "100%", maxWidth: "400px" }}
              />
            </Box>
          </Grid>

          {/* 📄 Upload + Summary */}
          <Grid item xs={12} md={7}>
            <Typography
              variant="h4"
              fontWeight={600}
              gutterBottom
              align="center"
              sx={{ mb: 3 }}
            >
              🧠 MediBridgePro
            </Typography>

            <Box textAlign="center" my={3}>
              {!file && !isLoading && (
                <Lottie animationData={uploadAnim} style={{ height: 160 }} />
              )}

              {file && (
                <Typography variant="subtitle1" gutterBottom>
                  📄 {file.name}
                </Typography>
              )}

              <label htmlFor="upload-pdf">
                <Input
                  accept="application/pdf"
                  id="upload-pdf"
                  type="file"
                  onChange={handleFileChange}
                />
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    mt: 2,
                    mb: 2,
                    transition: "0.3s",
                    fontWeight: "bold",
                    px: 3,
                    "&:hover": {
                      transform: "scale(1.05)",
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  Upload PDF
                </Button>
              </label>

              {file && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleUpload}
                  disabled={isLoading}
                  sx={{
                    ml: 2,
                    fontWeight: "bold",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      borderColor: "primary.dark",
                    },
                  }}
                >
                  Generate Summary
                </Button>
              )}

              {isLoading && (
                <Box mt={4}>
                  <Lottie animationData={processingAnim} style={{ height: 120 }} />
                  <Typography variant="body1" color="text.secondary">
                    Generating summary...
                  </Typography>
                  <CircularProgress sx={{ mt: 2 }} />
                </Box>
              )}
            </Box>

            <Slide direction="up" in={!!summary && !isLoading} mountOnEnter unmountOnExit>
  <Fade in={!!summary && !isLoading}>
    <Box mt={5}>
      <Typography
        variant="h5"
        fontWeight={700}
        color="primary"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        📝 Summary
      </Typography>

      <Box
        sx={{
          background: "linear-gradient(135deg, #ffffff, #f1f9ff)",
          borderLeft: "5px solid #1976d2",
          borderRadius: 3,
          p: 3,
          maxHeight: "320px",
          overflowY: "auto",
          fontFamily: "'Segoe UI', sans-serif",
          fontSize: "1.05rem",
          boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
          lineHeight: 1.7,
          transition: "all 0.4s ease",
        }}
      >
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-wrap", color: "#333" }}
        >
          {summary}
        </Typography>
      </Box>
    </Box>
  </Fade>
</Slide>

          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default App;
