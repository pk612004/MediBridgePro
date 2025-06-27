// src/App.js
import React, { useState } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { styled } from "@mui/system";
import jsPDF from "jspdf";
import Lottie from "lottie-react";
import uploadAnim from "./assets/upload.json";
import processingAnim from "./assets/processing.json";
import backgroundImage from "./assets/board-bg.png";
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

  const handleCopy = () => navigator.clipboard.writeText(summary);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("MediBridgePro - Summary", 40, 50);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(summary, 500);
    doc.text(lines, 40, 80);
    doc.save("summary.pdf");
  };

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  return (
    <Container maxWidth="md" className="upload-container">
      <Paper elevation={3} className="upload-box">
        <Typography variant="h4" fontWeight={600} gutterBottom align="center">
          🧠 MediBridgePro
        </Typography>

        {!file && !isLoading && (
          <Box textAlign="center" my={3}>
            <Lottie animationData={uploadAnim} style={{ height: 160 }} />
          </Box>
        )}

        <Box textAlign="center">
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
              className="action-btn"
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
              className="action-btn"
            >
              Generate Summary
            </Button>
          )}
        </Box>

        {isLoading && (
          <Box mt={4} textAlign="center">
            <Lottie animationData={processingAnim} style={{ height: 120 }} />
            <Typography variant="body1" color="text.secondary">
              Generating summary...
            </Typography>
            <CircularProgress sx={{ mt: 2 }} />
          </Box>
        )}

        {summary && !isLoading && (
          <Box mt={6} className="summary-box">
            <img
              src={backgroundImage}
              alt="Doctor Board"
              className="board-image"
            />
            <Box className="summary-text">
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {summary}
              </Typography>
              <Stack direction="row" spacing={2} mt={2}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopy}
                >
                  Copy
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleDownloadPDF}
                >
                  Download PDF
                </Button>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<VolumeUpIcon />}
                  onClick={handleSpeak}
                >
                  Read Aloud
                </Button>
              </Stack>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default App;