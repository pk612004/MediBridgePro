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

/* NEW: floating background SVGs */
import dnaIcon from "./assets/dna.svg";
import heartIcon from "./assets/heart.svg";
import stethIcon from "./assets/stethoscope.svg";

function App() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* ---------- Handlers ---------- */
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
      const res = await fetch(
        "https://medibridge-backend-l8cf.onrender.com/upload_pdf",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setSummary("❌ Error: Could not connect to backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "bold").setFontSize(18);
    doc.text("MediBridgePro - Summary", 40, 50);
    doc.setFont("Helvetica", "normal").setFontSize(12);
    doc.text(doc.splitTextToSize(summary, 500), 40, 80);
    doc.save("summary.pdf");
  };

  /* ---------- JSX ---------- */
  return (
    <Box className="main-wrapper">
      {/* floating decorative SVGs */}
      <img src={dnaIcon} className="bg-decor" style={{ top: "8%", left: "5%" }} alt="DNA" />
      <img src={heartIcon} className="bg-decor" style={{ bottom: "12%", right: "8%" }} alt="Heart" />
      <img src={stethIcon} className="bg-decor" style={{ top: "48%", left: "76%" }} alt="Stethoscope" />

      {/* upload / summary card */}
      <Paper elevation={6} className="upload-card">
        <Typography variant="h4" className="title">
          🧠 MediBridgePro
        </Typography>
        <Typography variant="subtitle1" className="subtitle">
          Upload Medical Report PDF
        </Typography>

        {/* dashed drop area */}
        <label htmlFor="pdf-upload" className="upload-box">
          <CloudUploadIcon sx={{ fontSize: 48, color: "#1976d2" }} />
          <Typography variant="body1">
            Drag & drop file here, or click to select
          </Typography>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            hidden
            onChange={handleFileChange}
          />
        </label>

        {/* action button */}
        <Button
          className="submit-btn"
          variant="contained"
          disabled={!file || isLoading}
          onClick={handleUpload}
        >
          {isLoading ? "Generating..." : "Generate Summary"}
        </Button>

        {isLoading && <CircularProgress sx={{ mt: 2 }} />}

        {/* summary output */}
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
