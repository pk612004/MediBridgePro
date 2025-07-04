# 🩺 MediBridgePro – AI Medical Report Summarizer

MediBridgePro is a smart healthcare assistant that simplifies medical communication by converting complex diagnostic PDFs into clean, human-friendly summaries. Built using **AI**, **OCR**, and **NLP**, it bridges the gap between medical professionals and patients—instantly.

---

##  Problem Statement

Most patients struggle to understand medical reports due to technical jargon and lack of visual clarity. This leads to:
- Delayed actions
- Poor medication adherence
- Over-dependence on doctors for minor doubts

---

##  Solution

**MediBridgePro** allows users to:
- Upload medical PDF reports
- Generate AI-powered summaries using Groq + spaCy
- View estimated **Health Risk Scores**
- Download a beautifully styled **Health Passport**
- Hear summaries using **Text-to-Speech**
- See detected **conditions, symptoms, medications** in a chart

---

##  Live Demo

 **[Try the App →](https://medibridge-frontend-w50t.onrender.com/)**  
 **[Watch Demo Video →](https://youtu.be/sNJrdmgbjMw)**

---

##  Key Features

| Feature                     | Description                                           |
|--------------------------|------------------------------------------------------|
|  PDF Upload              | Drag-and-drop medical PDFs securely                  |
|  AI Summary              | Uses LLM (Groq) + OCR to auto-generate summaries     |
|  Health Score            | Animated score to indicate overall wellness          |
|  Text-to-Speech          | Summary can be read aloud instantly                  |
|  Health Passport         | Download structured PDF with highlights              |
|  Medical Entity Chart    | Extracts & visualizes symptoms, medications, etc.    |

---

##  Tech Stack

**Frontend:** React.js, Material UI, Lottie, Framer Motion  
**Backend:** Python (Flask), Groq API, spaCy, OCR (pdf2image, pytesseract)  
**PDF Styling:** jsPDF  
**Hosting:** Render

---

##  Performance & Metrics

-  **92%+ summary accuracy** (tested on 10 real reports)
-  **<10 seconds** response time
-  Works on all modern browsers & devices
-  **Roadmap:** Multilingual support, ICD-10 tagging, Doctor Feedback loop

