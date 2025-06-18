from groq import Groq

client = Groq(
    api_key="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"  # just this!
)

def generate_summary(medical_text):
    try:
        prompt = f"""You are a medical assistant. Summarize the following medical report clearly and professionally:

        {medical_text}

        Provide the summary with the following structure:
        - Patient Overview
        - Diagnoses
        - Medical History Summary
        - Doctor's Observations
        - Doctor’s Opinion
        - Final Prognosis
        """

        response = client.chat.completions.create(
            model="llama3-8b-8192",  # ✅ Groq-supported model
            messages=[
                {"role": "system", "content": "You are a medical assistant specialized in summarizing reports."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"[ERROR] GPT failed: {e}"
