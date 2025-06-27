// src/App.js
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import jsPDF from "jspdf";
import "./App.css";

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

  return (
    <Box className="main-wrapper">
      <Paper className="upload-card" elevation={6}>
        <Typography variant="h4" className="title">
          🧠 MediBridgePro
        </Typography>
        <Typography variant="subtitle1" className="subtitle">
          Upload Medical Report PDF
        </Typography>

        <label htmlFor="pdf-upload" className="upload-box">
          <CloudUploadIcon sx={{ fontSize: 48, color: "#1976d2" }} />
          <Typography variant="body1">
            Drag & drop file here, or click to select
          </Typography>
          <input
            type="file"
            id="pdf-upload"
            accept="application/pdf"
            hidden
            onChange={handleFileChange}
          />
        </label>

        <Button
          variant="contained"
          className="submit-btn"
          onClick={handleUpload}
          disabled={!file || isLoading}
        >
          {isLoading ? "Generating..." : "Generate Summary"}
        </Button>

        {isLoading && <CircularProgress sx={{ mt: 2 }} />}

        {summary && !isLoading && (
          <Box className="summary-box">
            <Typography variant="h6" gutterBottom>
              Report Summary
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {summary}
            </Typography>
            <Stack direction="row" spacing={2} mt={2}>
              <Button variant="outlined" onClick={handleDownloadPDF}>
                Download PDF
              </Button>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default App;
