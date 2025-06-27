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
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { styled } from "@mui/system";
import Lottie from "lottie-react";
import uploadAnim from "./assets/upload.json";
import processingAnim from "./assets/processing.json";
import illustration from "./assets/illustration.png";
import jsPDF from "jspdf";
import "./App.css";

const Input = styled("input")({ display: "none" });

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

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(summary, 10, 20, { maxWidth: 180 });
    doc.save("MediBridge_Summary.pdf");
  };

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* ✅ Option 1: Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          background: "linear-gradient(120deg, #e0f7fa, #f1f8ff)",
          borderBottom: "1px solid #ddeeff",
        }}
      >
        <Typography variant="h3" fontWeight={600} gutterBottom>
          Transform Your Health Reports with AI
        </Typography>
        <Typography variant="h6" color="text.secondary" maxWidth="md" mx="auto">
          Upload your medical PDFs and get instant summaries with AI-generated health passports.
          Secure. Accurate. Fast.
        </Typography>
      </Box>

      {/* Upload UI */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
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
            <Grid item xs={12} md={5}>
              <Box display="flex" justifyContent="center" alignItems="center">
                <img src={illustration} alt="medical" style={{ width: "100%", maxWidth: "400px" }} />
              </Box>
            </Grid>

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
                  <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                      📝 Summary:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: "pre-wrap",
                        backgroundColor: "#f5faff",
                        p: 3,
                        borderRadius: 3,
                        fontFamily: "Georgia, serif",
                        fontSize: "16px",
                        lineHeight: 1.6,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        border: "1px solid #ddeeff",
                        color: "#333",
                      }}
                    >
                      {summary}
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                      <Button
                        variant="outlined"
                        startIcon={<VolumeUpIcon />}
                        onClick={handleSpeak}
                      >
                        Read Aloud
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<FileDownloadIcon />}
                        onClick={handleDownload}
                      >
                        Download PDF
                      </Button>
                    </Stack>
                  </Box>
                </Fade>
              </Slide>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* ✅ Option 3: Footer */}
      <Box
        sx={{
          mt: 10,
          py: 4,
          textAlign: "center",
          backgroundColor: "#f9f9fb",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2025 MediBridgePro | Built with ❤️ for better healthcare
        </Typography>
      </Box>
    </>
  );
}

export default App;
