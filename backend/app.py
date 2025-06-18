from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import fitz  # PyMuPDF
from ai.gpt_engine import generate_summary  # Groq-based summarizer


# -------------------- Flask App Setup --------------------
app = Flask(__name__)
app.secret_key = "supersecretkey123"  # Change this in production

# Enable CORS with credentials support for session management
CORS(app, supports_credentials=True)

# -------------------- Upload PDF Setup --------------------
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# Upload PDF route
@app.route("/upload_pdf", methods=["POST"])
def upload_pdf():
    # Optional: Require login before allowing upload
    # if "user" not in session:
    #     return jsonify({"error": "Unauthorized"}), 401

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    try:
        # Read PDF content
        with fitz.open(filepath) as pdf:
            text = ""
            for page in pdf:
                text += page.get_text()

        summary = generate_summary(text)
        return jsonify({"summary": summary})

    except Exception as e:
        return jsonify({"summary": f"[ERROR] {str(e)}"}), 500


# -------------------- Main --------------------
if __name__ == "__main__":
    app.run(debug=True)
