# MediBridgePro – Making Medical Reports Understandable with AI

## Overview  
Medical reports are long, technical, and overwhelming—especially for patients.  
MediBridgePro is your AI-powered companion that turns complex medical documents into simple summaries, health scores, charts, and even a personal Health Passport—all in seconds.  

Built for speed, accuracy, and clarity, MediBridgePro brings the power of LLMs, NLP, OCR, and medical AI together in one sleek web app.

## Features  

- **AI Summarization**  
  Upload a medical report (PDF) and get an instant, easy-to-understand summary powered by Groq's LLM.

- **Medical Entity Chart**  
  Visual chart of detected medical entities like drugs, conditions, and vitals—parsed using advanced NLP.

- **Health Risk Score + Animation**  
  An animated health score provides a quick glance at overall risk level in a friendly format.

- **AI Follow-Up Suggestions**  
  Automatically generate basic follow-up suggestions based on report content.

- **Health Passport (PDF Output)**  
  Download a simplified, clean PDF version of your medical summary—ideal for patients, caregivers, and second opinions.

- **OCR Image Upload**  
  Upload photos of scanned or printed reports, and we’ll extract and analyze them just like PDFs.

- **Voice Command Support (Experimental)**  
  Use simple voice commands to interact with the app, offering hands-free control and accessibility.

## Why It Matters  

- 80% of patients don’t understand their own medical documents  
- Doctors are busy, and patients often feel lost  
- MediBridgePro bridges that gap with intelligence, empathy, and simplicity  
- Designed for elderly users, caregivers, and busy professionals who need clarity and speed

## Tech Stack  

| Layer       | Tools/Technologies                          |
|-------------|---------------------------------------------|
| Frontend    | React.js, Material UI                       |
| Backend     | Flask (Python)                              |
| AI & NLP    | Groq LLM, spaCy, Tesseract OCR              |
| Utilities   | pdf2image, fpdf                             |
| Deployment  | Render                                      |

## Live Demo  

Try it here: [https://medibridge-frontend-w50t.onrender.com](https://medibridge-frontend-w50t.onrender.com)

## How to Run Locally  

### Clone the Repository  
```bash
git clone https://github.com/yourusername/medibridgepro
```

### Backend Setup  
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Frontend Setup  
```bash
cd frontend
npm install
npm start
```
