

from dotenv import load_dotenv
import os
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_summary(medical_text, language="English"):
    try:
        print(" FINAL PIPELINE RUNNING")
        print(" LANGUAGE:", language)

        prompt = f"""
You are a medical assistant.

IMPORTANT:
You MUST generate the final output ONLY in {language}.
Do NOT use English at all unless language is English.

If language is Hindi:
- Use ONLY Hindi (Devanagari script)
- No English words allowed

TASK:
Summarize this medical report in simple language.

Structure:
- Patient Overview
- Diagnoses
- Medical History
- Observations
- Final Conclusion

Medical Report:
{medical_text}
"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": f"You ONLY respond in {language}. Never use English."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"[ERROR]: {str(e)}"