from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import fitz  # PyMuPDF
from ai.gpt_engine import generate_summary  # Groq-based summarizer

# -------------------- Flask App Setup --------------------
app = Flask(__name__)
app.secret_key = "supersecretkey123"

CORS(app, supports_credentials=True)

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ✅ Health check route
@app.route("/")
def home():
    return jsonify({"message": "✅ MediBridgePro Backend is Live!"})

# Upload PDF
@app.route("/upload_pdf", methods=["POST"])
def upload_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    try:
        with fitz.open(filepath) as pdf:
            text = ""
            for page in pdf:
                text += page.get_text()

        summary = generate_summary(text)
        return jsonify({"summary": summary})

    except Exception as e:
        return jsonify({"summary": f"[ERROR] {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)
