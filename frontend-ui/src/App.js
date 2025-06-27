// Updated App.js – Step 2: Add Animated Graphs to Diagnosis Tab

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Box,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import jsPDF from "jspdf";
import { styled } from "@mui/system";
import Lottie from "lottie-react";
import uploadAnim from "./assets/upload.json";
import processingAnim from "./assets/processing.json";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import "./App.css";

const Input = styled("input")({ display: "none" });

function App() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [icdData, setIcdData] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState([]); // new
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSummary("");
    setIcdData([]);
    setDiagnosisData([]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://medibridge-backend-l8cf.onrender.com/upload_pdf", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setSummary(data.summary || "");
      setIcdData(data.icd_codes || []);
      setDiagnosisData(data.diagnosis_chart || []); // expects: [ { name, severity (1-10) } ]
    } catch (err) {
      setSummary("❌ Error: Could not connect to backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("MediBridgePro – Summary", 40, 50);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(summary, 500);
    doc.text(lines, 40, 80);
    doc.save("summary.pdf");
  };

  const renderTabContent = () => {
    switch (tab) {
      case 0:
        return (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {summary}
              </Typography>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Risk Severity by Diagnosis
            </Typography>
            {diagnosisData.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No diagnosis data available.
              </Typography>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={diagnosisData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="severity">
                    {diagnosisData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.severity > 7 ? "#e57373" : entry.severity > 4 ? "#ffb74d" : "#81c784"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Box>
        );
      case 2:
        return (
          <Stack spacing={2} mt={3}>
            {icdData.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No ICD-10 codes extracted.
              </Typography>
            ) : (
              icdData.map((item, idx) => (
                <Card key={idx} variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {item.code}
                    </Typography>
                    <Typography variant="body2">{item.desc}</Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MediBridgePro Health Report
          </Typography>
          <IconButton aria-label="print">
            <PrintIcon />
          </IconButton>
          <IconButton aria-label="download" onClick={handleDownloadPDF}>
            <FileDownloadIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
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
              sx={{ ml: 2 }}
              onClick={handleUpload}
              disabled={isLoading}
            >
              Generate Summary
            </Button>
          )}
        </Box>

        {isLoading && (
          <Box mt={4} textAlign="center">
            <Lottie animationData={processingAnim} style={{ height: 120 }} />
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Generating summary…
            </Typography>
            <CircularProgress sx={{ mt: 2 }} />
          </Box>
        )}

        {summary && !isLoading && (
          <Box>
            <Tabs
              value={tab}
              onChange={(e, newVal) => setTab(newVal)}
              textColor="primary"
              indicatorColor="primary"
              sx={{ mt: 4 }}
            >
              <Tab label="Summary" />
              <Tab label="Diagnosis" />
              <Tab label="ICD-10 Codes" />
            </Tabs>
            {renderTabContent()}
            <Stack direction="row" spacing={2} mt={3}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={() => navigator.clipboard.writeText(summary)}
              >
                Copy
              </Button>
              <Button
                variant="text"
                size="small"
                startIcon={<VolumeUpIcon />}
                onClick={() => {
                  const u = new SpeechSynthesisUtterance(summary);
                  speechSynthesis.speak(u);
                }}
              >
                Read Aloud
              </Button>
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default App;