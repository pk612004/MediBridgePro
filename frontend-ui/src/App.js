
import React, { useState, useMemo } from "react";
import {
  Button, Container, Typography, Box, Paper,
  CircularProgress, Slide, Fade, Grid, Stack,Select,MenuItem
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { styled } from "@mui/system";
import Lottie from "lottie-react";
import { Typewriter } from "react-simple-typewriter";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { motion } from "framer-motion";
import "react-circular-progressbar/dist/styles.css";
import uploadAnim     from "./assets/upload.json";
import processingAnim from "./assets/processing.json";
import illustration   from "./assets/illustration.png";
import side1          from "./assets/side1.png";
import side2          from "./assets/side2.png";
import jsPDF          from "jspdf";
import "./App.css";
const Input = styled("input")({ display: "none" });
const healthTips = [
  "Drink 2 L water daily 💧",
  "Wash hands regularly 🧼",
  "Sleep 7-8 hrs every night 🛌",
  "30-min exercise each day 🏃‍♀️",
];

const computeRiskScore = (text) => {
  if (!text) return 0;
  const lower = text.toLowerCase();
  let score = 50;                               
  const highRisk   = ["critical", "severe", "stroke", "cancer", "dementia"];
  const midRisk    = ["abnormal", "elevated", "hypertension", "diabetes"];
  const lowRiskPos = ["normal", "unremarkable", "stable", "within normal"];
  highRisk.forEach((w) =>  lower.includes(w) && (score += 15));
  midRisk.forEach((w) =>   lower.includes(w) && (score += 8));
  lowRiskPos.forEach((w) => lower.includes(w) && (score -= 10));
  score = Math.max(0, Math.min(100, score));
  return score;
};
const RiskScoreCard = ({ score }) => {
  const color =
    score >= 70 ? "#e53935" : score >= 40 ? "#f5a623" : "#43a047";
  const label = score >= 70 ? "High Risk" : score >= 40 ? "Moderate" : "Low";
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="glassmorphism"
      style={{
        padding: "2rem",
        borderRadius: "1.5rem",
        textAlign: "center",
        backdropFilter: "blur(12px)",
        background: "rgba(255,255,255,0.4)",
        width: "260px",
        margin: "auto",
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={2}>
        🩺 Health Risk Score
      </Typography>
      <div style={{ width: 140, height: 140, margin: "auto" }}>
        <CircularProgressbar
          value={score}
          text={`${score}%`}
          styles={buildStyles({
            pathColor: color,
            textColor: "#333",
            trailColor: "#d6d6d6",
            textSize: "20px",
            pathTransitionDuration: 1.2,
          })}
        />
      </div>
      <Typography mt={2} fontWeight={600} color={color}>
        {label}
      </Typography>
    </motion.div>
  );
};
function App() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [file, setFile]       = useState(null);
  const [summary, setSummary] = useState("");
  const [isLoading, setLoad]  = useState(false);
  const [language, setLanguage] = useState("English");
    const riskScore = useMemo(
    () => computeRiskScore(summary),
    [summary]
  );
  const handleFileChange = (e) => { setFile(e.target.files[0]); setSummary(""); };
  const handleUpload = async () => {
    if (!file) return;
    setLoad(true);
    const fd = new FormData(); fd.append("file", file);
    fd.append("language", language);
    try {
      const r = await fetch("https://medibridge-frontend-w50t.onrender.com/upload_pdf", {
        method: "POST", body: fd,
      });
      const { summary } = await r.json();
      setSummary(summary);
    } catch { setSummary(" Error: Could not connect to backend."); }
    finally { setLoad(false); }
  };
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text(summary, 10, 20, { maxWidth: 180 });
    doc.save("MediBridge_Summary.pdf");
  };
  // const handleSpeak = () => {
  //   const u = new SpeechSynthesisUtterance(summary);
  //   window.speechSynthesis.speak(u);
  // };
  const handleSpeak = () => {
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  } else {
    const u = new SpeechSynthesisUtterance(summary);

    u.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(u);
    setIsSpeaking(true);
  }
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
      {}
      <Box sx={{
        textAlign:"center", py:8,
        background:"linear-gradient(135deg,#d0f1ff 0%,#e3f6ff 100%)",
        borderBottom:"1px solid #cce0ff",
      }}>
        <Typography variant="h2" sx={{
          fontWeight:800,
          fontFamily:"Playfair Display, serif",
          background:"linear-gradient(90deg,#4facfe 0%,#00f2fe 100%)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          animation:"pulse 2.5s infinite"
        }}>
          MediBridge&nbsp;Pro
        </Typography>
        <Typography
          variant="h6" color="text.secondary" maxWidth="md" mx="auto" mt={2}>
          <Typewriter
            words={[
              "AI-generated medical summaries 📑",
              "Instant health passports 📜",
              "Secure PDF uploads 🔐",
            ]}
            loop={0} cursor cursorStyle="_"
            typeSpeed={60} deleteSpeed={40} delaySpeed={2000}
          />
        </Typography>
        <style>{`
          @keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.04)}100%{transform:scale(1)}}
        `}</style>
      </Box>
      {}
      <Box sx={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:3,mt:4,mb:6,px:2}}>
        {healthTips.map((tip,i)=>(
          <Box key={i} sx={{
            px:3,py:1,borderRadius:20,
            background:"rgba(255,255,255,0.6)",backdropFilter:"blur(10px)",
            fontWeight:500,color:"#003366",
            animation:`floatTip${i} 10s ease-in-out infinite`
          }}>
            <Typewriter words={[tip]} loop={0} cursor typeSpeed={60} deleteSpeed={30} delaySpeed={2500}/>
            <style>{`
              @keyframes floatTip${i}{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
            `}</style>
          </Box>
        ))}
      </Box>
      {}
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Paper elevation={3} sx={{
          p:6, borderRadius:6, background:"rgba(255,255,255,0.2)",
          backdropFilter:"blur(16px)", boxShadow:"0 8px 32px rgba(0,0,0,0.1)",
          border:"1px solid rgba(255,255,255,0.4)", position:"relative", zIndex:1
        }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <img src={illustration} alt="AI"
                   style={{width:"90%",borderRadius:20,maxHeight:320}}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box textAlign="center">
                {!file && !isLoading && <Lottie animationData={uploadAnim} style={{height:150}}/>}
                {file && <Typography variant="subtitle1" gutterBottom>📄 {file.name}</Typography>}
                {/* <Select
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
  sx={{ mt: 2, minWidth: 200 }}
>
  <MenuItem value="English">English</MenuItem>
  <MenuItem value="Hindi">Hindi</MenuItem>
  <MenuItem value="Punjabi">Punjabi</MenuItem>
  <MenuItem value="Urdu">Urdu</MenuItem>
</Select> */}
<Select
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
  displayEmpty
  sx={{
    mt: 4,
    minWidth: 220,
    height: 45,

    display: "flex",
    alignItems: "center",   

    background: "rgba(255, 255, 255, 0.98)",
    fontWeight: 500,
    color: "#1a1a1a",
    px: 1,

    borderRadius: "8px",   

    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      height: "100%",      
      padding: "0 10px",
    },

    "& fieldset": {
      borderColor: "#1976d2",   
    },

    "&:hover fieldset": {
      borderColor: "#1565c0",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#1976d2",
      borderWidth: "2px",
    }
  }}
>
  <MenuItem value="English"> English</MenuItem>
  <MenuItem value="Hindi"> Hindi</MenuItem>
  <MenuItem value="Punjabi"> Punjabi</MenuItem>
  <MenuItem value="Urdu"> Urdu</MenuItem>
</Select>
                <label htmlFor="upload-pdf">
                  <Input id="upload-pdf" type="file" accept="application/pdf" onChange={handleFileChange}/>
                  <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}
                          sx={{ mt:2,fontWeight:600 }}>Upload PDF</Button>
                </label>
                {file && (
                  <Button variant="outlined" sx={{ mt:2,ml:2,fontWeight:600 }}
                          disabled={isLoading} onClick={handleUpload}>
                    Generate Summary
                  </Button>
                )}
                {isLoading && (
                  <Box mt={4}>
                    <Lottie animationData={processingAnim} style={{height:100}}/>
                    <Typography color="text.secondary">Analyzing report…</Typography>
                    <CircularProgress sx={{ mt:2 }}/>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
          {}
          {!!summary && !isLoading && (
            <Box mt={6}>
              <RiskScoreCard score={riskScore} />
            </Box>
          )}
          {}
          <Slide direction="up" in={!!summary && !isLoading} mountOnEnter unmountOnExit>
            <Fade in={!!summary && !isLoading}>
              <Box mt={6} className="summary-card">
                <Typography variant="h6" gutterBottom>📝 Summary:</Typography>
                <Typography variant="body1" sx={{
                  whiteSpace:"pre-wrap", fontFamily:"Georgia, serif",
                  fontSize:"1rem", lineHeight:1.6, color:"#1a1a1a"
                }}>
                  {summary}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt:3 }}>
                  <Button variant="outlined" startIcon={<VolumeUpIcon/>} onClick={handleSpeak}>
                    {isSpeaking ? "Stop Audio" : "Read Aloud"}
                  </Button>
                  <Button variant="contained" startIcon={<FileDownloadIcon/>} onClick={handleDownload}>
                    Download PDF
                  </Button>
                </Stack>
              </Box>
            </Fade>
          </Slide>
        </Paper>
      </Container>
      {}
      <Box sx={{ mt:10, py:4, textAlign:"center" ,
        backgroundColor:"#f0f6ff", borderTop:"1px solid #dce8f8" }}>
        <Typography variant="body2" color="text.secondary">
          © 2026 MediBridgePro | Built with 💖 for better healthcare
        </Typography>
      </Box>
    </>
  );
}
export default App;




