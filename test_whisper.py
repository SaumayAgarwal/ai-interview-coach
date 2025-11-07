# test_whisper.py
import whisper

# Load model once
print("🚀 Loading Whisper model...")
model = whisper.load_model("base")

def transcribe_audio(audio_path: str, language: str = "hi") -> str:
    """Transcribe audio file using Whisper"""
    result = model.transcribe(audio_path, language=language)
    return result["text"]
