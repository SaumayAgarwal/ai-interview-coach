# app.py
import os
import tempfile
from fastapi import FastAPI, UploadFile, File
import uvicorn

from extract_audio import extract_audio_from_video
from test_whisper import transcribe_audio
from nlp_analysis import analyze_interview_text_simple

app = FastAPI(title="AI Interview Analyzer", version="2.0")

@app.post("/analyze_media")
async def analyze_media(file: UploadFile = File(...)):
    tmp_path = None
    audio_path = None
    try:
        # Save uploaded file temporarily
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
            tmp_file.write(await file.read())
            tmp_path = tmp_file.name

        # Extract audio if video
        if suffix.lower() in [".mp4", ".mov", ".mkv", ".avi"]:
            audio_path = extract_audio_from_video(tmp_path)
        else:
            audio_path = tmp_path

        # Transcribe
        transcript = transcribe_audio(audio_path)

        # Analyze
        analysis = analyze_interview_text_simple(transcript)

        return {"analysis": analysis}

    except Exception as e:
        return {"error": str(e)}

    finally:
        # Clean up temporary files
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)
        if audio_path and audio_path != tmp_path and os.path.exists(audio_path):
            os.remove(audio_path)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
