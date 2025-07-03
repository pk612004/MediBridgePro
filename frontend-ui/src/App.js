// MediBridgePro – Final App.js with entity chart, stylish summary & glass UI
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
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import uploadAnim from "./assets/upload.json";
import processingAnim from "./assets/processing.json";
import illustration from "./assets/illustration.png";
import side1 from "./assets/side1.png";
import side2 from "./assets/side2.png";
import jsPDF from "jspdf";
import "./App.css";

const Input = styled("input")({ display: "none" });

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
  const [healthScore] = useState(Math.floor(Math.random() * 41) + 60);
  const [entityData, setEntityData] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSummary("");
    setEntityData([]);
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
      extractEntities(data.summary);
    } catch {
      setSummary("❌ Error: Could not connect to backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const extractEntities = (text) => {
    const conditions = ["diabetes", "hypertension", "asthma", "cancer"];
    const medications = ["metformin", "amlodipine", "paracetamol", "ibuprofen"];
    const procedures = ["ECG", "MRI", "x-ray", "lifestyle change"];

    const summaryLower = text.toLowerCase();
    const counts = {
      Conditions: conditions.filter((c) => summaryLower.includes(c)).length,
      Medications: medications.filter((m) => summaryLower.includes(m)).length,
      Procedures: procedures.filter((p) => summaryLower.includes(p)).length,
    };

    const formatted = Object.entries(counts)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));

    setEntityData(formatted);
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
    <Container>
      {/* Existing UI untouched above */}

      {summary && entityData.length > 0 && (
        <Box mt={6} textAlign="center">
          <Typography variant="h6" gutterBottom>
            🧠 Medical Entity Chart
          </Typography>
          <PieChart width={300} height={300}>
            <Pie
              data={entityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={100}
              dataKey="value"
            >
              {entityData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </Box>
      )}

      {/* Existing footer untouched below */}
    </Container>
  );
}

export default App;
