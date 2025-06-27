// App.js – MediBridgePro Frontend with Hero UI
import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  Stack,
  IconButton,
  Grid,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import jsPDF from "jspdf";
import { styled } from "@mui/system";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import uploadAnim from "./assets/upload.json";
import processingAnim from "./assets/processing.json";
import doctorIllustration from "./assets/doctor-flat.svg";
import "./App.css";

const Input = styled("input")({ display: "none" });

function App() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [icdData, setIcdData] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState([]);
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
      setDiagnosisData(data.diagnosis_chart || []);
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
      {/* HERO SECTION */}
      <Box
        sx={{
          px: 4,
          py: 6,
          background: "linear-gradient(135deg, #e0f7fa, #f3e5f5)",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ maxWidth: 500 }}>
          <Typography variant="h3" fontWeight={700} color="#222" gutterBottom>
            MediBridgePro
          </Typography>
          <Typography variant="h5" fontWeight={400} color="text.secondary">
            Smart Health Summarizer
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ my: 2 }}>
            Upload medical reports (PDF), get instant AI-generated summaries & ICD-10 insights.
          </Typography>

          {/* Upload Button */}
          <label htmlFor="upload-pdf">
            <Input accept="application/pdf" id="upload-pdf" type="file" onChange={handleFileChange} />
            <Button
              variant="contained"
              component="span"
              size="large"
              sx={{
                borderRadius: "25px",
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                mt: 2,
                backgroundColor: "#ff5252",
                "&:hover": {
                  backgroundColor: "#ff1744",
                },
              }}
            >
              GET REPORT
            </Button>
          </label>
          {file && (
            <Button
              variant="outlined"
              sx={{ ml: 2, mt: 2 }}
              onClick={handleUpload}
              disabled={isLoading}
            >
              Generate Summary
            </Button>
          )}
        </Box>

        {/* Doctor Illustration */}
        <Box sx={{ mt: { xs: 4, md: 0 } }}>
          <motion.img
            src={doctorIllustration}
            alt="Doctor Illustration"
            style={{ width: "100%", maxWidth: 350 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          />
        </Box>
      </Box>

      {/* MAIN CONTENT */}
      <Container maxWidth="md" sx={{ mt: 4 }}>
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
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {renderTabContent()}
            </motion.div>
            <Stack direction="row" spacing={2} mt={3}>
              <Button variant="outlined" size="small" startIcon={<ContentCopyIcon />} onClick={() => navigator.clipboard.writeText(summary)}>
                Copy
              </Button>
              <Button variant="text" size="small" startIcon={<VolumeUpIcon />} onClick={() => speechSynthesis.speak(new SpeechSynthesisUtterance(summary))}>
                Read Aloud
              </Button>
              <Button variant="contained" size="small" onClick={handleDownloadPDF} startIcon={<FileDownloadIcon />}>
                Download PDF
              </Button>
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default App;
