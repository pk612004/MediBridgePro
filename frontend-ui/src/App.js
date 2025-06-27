// MediBridgePro – Final App.js with react-simple-typewriter and glass UI
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
import { Typewriter } from "react-simple-typewriter";
import uploadAnim from "./assets/upload.json";
import processingAnim from "./assets/processing.json";
import illustration from "./assets/illustration.png";
import side1 from "./assets/side1.png";
import side2 from "./assets/side2.png";
import jsPDF from "jspdf";
import "./App.css";

const Input = styled("input")({ display: "none" });

const healthTips = [
  "Drink 2 L water daily 💧",
  "Wash hands regularly 🧼",
  "Sleep 7-8 hrs every night 🛌",
  "30-min exercise each day 🏃‍♀️",
];

function App() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
    } catch {
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
      <div className="plus-bg" />

      <img src={side1} alt="" className="floating-decor floating-1" />
      <img src={side2} alt="" className="floating-decor floating-2" />
      <div className="floating-quote floating-quote-top">
        “Every report is a step closer to healing.”
      </div>
      <div className="floating-quote floating-quote-bottom">
        “Technology + empathy = MediBridgePro.”
      </div>

      <Box
        sx={{
          textAlign: "center",
          py: 8,
          background: "linear-gradient(135deg,#d0f1ff 0%,#e3f6ff 100%)",
          borderBottom: "1px solid #cce0ff",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            fontFamily: "Playfair Display, serif",
            background: "linear-gradient(90deg,#4facfe 0%,#00f2fe 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "pulse 2.5s infinite",
          }}
        >
          MediBridge&nbsp;Pro
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          maxWidth="md"
          mx="auto"
          mt={2}
        >
          <Typewriter
            words={[
              "AI-generated medical summaries 📑",
              "Instant health passports 📜",
              "Secure PDF uploads 🔐",
            ]}
            loop={0}
            cursor
            cursorStyle="_"
            typeSpeed={60}
            deleteSpeed={40}
            delaySpeed={2000}
          />
        </Typography>
        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.04); }
            100% { transform: scale(1); }
          }
        `}</style>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 3,
          mt: 4,
          mb: 6,
          px: 2,
        }}
      >
        {healthTips.map((tip, i) => (
          <Box
            key={i}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 20,
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              fontWeight: 500,
              color: "#003366",
              animation: `floatTip${i} 10s ease-in-out infinite`,
            }}
          >
            <Typewriter
              words={[tip]}
              loop={0}
              cursor
              typeSpeed={60}
              deleteSpeed={30}
              delaySpeed={2500}
            />
            <style>{`
              @keyframes floatTip${i} {
                0%,100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
            `}</style>
          </Box>
        ))}
      </Box>

      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 6,
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            border: "1px solid rgba(255,255,255,0.4)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <img
                src={illustration}
                alt="AI Medical"
                style={{ width: "90%", borderRadius: 20, maxHeight: 320 }}
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
                  <Input
                    id="upload-pdf"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
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
                    disabled={isLoading}
                    onClick={handleUpload}
                  >
                    Generate Summary
                  </Button>
                )}
                {isLoading && (
                  <Box mt={4}>
                    <Lottie animationData={processingAnim} style={{ height: 100 }} />
                    <Typography color="text.secondary">Analyzing report…</Typography>
                    <CircularProgress sx={{ mt: 2 }} />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>

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
