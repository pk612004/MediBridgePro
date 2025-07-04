MediBridgePro – Making Medical Reports Understandable with AI

OVERVIEW
Medical reports are long, technical, and overwhelming—especially for patients.
MediBridgePro is your AI-powered companion that turns complex medical documents into simple summaries, health scores, charts, and even a personal Health Passport—all in seconds.
Built for speed, accuracy, and clarity, MediBridgePro brings the power of LLMs, NLP, OCR, and medical AI together in one sleek web app.

FEATURES
-AI Summarization
Upload a medical report (PDF) and get an instant, easy-to-understand summary powered by Groq's LLM.
-Medical Entity Chart
Visual chart of detected medical entities like drugs, conditions, vitals—parsed from your report using advanced NLP.
-Health Risk Score + Animation
An animated health score gives patients a quick glance at overall risk level—intuitive and friendly.
-AI Follow-Up Suggestions
Automatically generate basic follow-up suggestions or prompts based on your report contents.
-Health Passport PDF Output
Download a simplified, clean PDF version of your medical summary—ideal for patients, caregivers, and second opinions.
-OCR Image Upload
Upload photos of scanned or printed reports, and we’ll extract and analyze them just like PDFs.
-Voice Command Support
Say it, don’t type it. Control the app with simple voice commands (experimental feature).

WHY ITS MATTERS ?
80% of patients don’t understand their own medical documents
Doctors are busy, and patients feel lost
Our app bridges that gap with intelligence, empathy, and simplicity
Whether it’s for elderly users, caregivers, or busy professionals—MediBridgePro makes medical language human.

TECH STACK
Frontend	Backend	AI & NLP	Other
React.js + MUI	Flask (Python)	Groq LLM, spaCy, Tesseract OCR	fpdf, pdf2image, Render deployment

LIVE DEMO
Try It Here (Deployed on Render)

HOW TO RUN LOCALLY ?
# Clone the repo
git clone https://github.com/yourusername/medibridgepro

# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py

# Frontend setup
cd frontend
npm install
npm start
