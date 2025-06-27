// MediBridgePro – Stunning Glassmorphism UI Layout with Medical Decor, Plus Sign Background + Quotes
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
import side1 from "./assets/side1.png";
import side2 from "./assets/side2.png";
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
      {/* Background with medical plus signs */}
      <div className="plus-bg" />

      {/* Floating Decor & Quotes */}
      <img src={side1} alt="floating1" className="floating-decor floating-1" />
      <img src={side2} alt="floating2" className="floating-decor floating-2" />
      <div className="floating-quote floating-quote-top">
        “Every report is a step closer to healing.”
      </div>
      <div className="floating-quote floating-quote-bottom">
        “Technology + empathy = MediBridgePro.”
      </div>

      {/* Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          background: "linear-gradient(135deg, #d0f1ff 0%, #e3f6ff 100%)",
          borderBottom: "1px solid #cce0ff",
        }}
      >
        <Typography variant="h3" fontWeight={700} gutterBottom color="#003366">
          Transform Your Health Reports with AI 🧠
        </Typography>
        <Typography variant="h6" color="text.secondary" maxWidth="md" mx="auto">
          Upload your medical PDFs and get AI-generated summaries + health passports.
        </Typography>
      </Box>

      {/* Upload Section with Glassmorphism */}
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 6,
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.4)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <img
                src={illustration}
                alt="AI Medical"
                style={{ width: "90%", borderRadius: "20px", maxHeight: "320px" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box textAlign="center">
                {!file && !isLoading && (
                  <Lottie animationData={uploadAnim} style={{ height: 150 }} />
                )}

                {file && (
                  <Typography variant="subtitle1" gutterBottom>
                    📄 {file.name}
                  </Typography>
                )}

                <label htmlFor="upload-pdf">
                  <Input accept="application/pdf" id="upload-pdf" type="file" onChange={handleFileChange} />
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mt: 2, fontWeight: 600 }}
                  >
                    Upload PDF
                  </Button>
                </label>

                {file && (
                  <Button
                    variant="outlined"
                    sx={{ mt: 2, ml: 2, fontWeight: 600 }}
                    onClick={handleUpload}
                    disabled={isLoading}
                  >
                    Generate Summary
                  </Button>
                )}

                {isLoading && (
                  <Box mt={4}>
                    <Lottie animationData={processingAnim} style={{ height: 100 }} />
                    <Typography color="text.secondary">Analyzing report...</Typography>
                    <CircularProgress sx={{ mt: 2 }} />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Summary Output */}
          <Slide direction="up" in={!!summary && !isLoading} mountOnEnter unmountOnExit>
            <Fade in={!!summary && !isLoading}>
              <Box mt={6} className="summary-card">
                <Typography variant="h6" gutterBottom>
                  📝 Summary:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "Georgia, serif",
                    fontSize: "1rem",
                    lineHeight: 1.6,
                    color: "#1a1a1a",
                  }}
                >
                  {summary}
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button variant="outlined" startIcon={<VolumeUpIcon />} onClick={handleSpeak}>
                    Read Aloud
                  </Button>
                  <Button variant="contained" startIcon={<FileDownloadIcon />} onClick={handleDownload}>
                    Download PDF
                  </Button>
                </Stack>
              </Box>
            </Fade>
          </Slide>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          mt: 10,
          py: 4,
          textAlign: "center",
          backgroundColor: "#f0f6ff",
          borderTop: "1px solid #dce8f8",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2025 MediBridgePro | Built with 💖 for better healthcare
        </Typography>
      </Box>
    </>
  );
}

export default App;
