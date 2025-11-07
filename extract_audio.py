# extract_audio.py
import ffmpeg
import tempfile
import os

def extract_audio_from_video(video_file_path: str, audio_format: str = "mp3") -> str:
    """
    Extracts audio from a video file and returns the path to the audio file.

    Parameters:
    - video_file_path: Path to the video file.
    - audio_format: Desired audio format (default 'mp3').

    Returns:
    - Path to the extracted audio file.
    """
    # Create a temporary file for the audio
    tmp_audio_file = tempfile.NamedTemporaryFile(delete=False, suffix=f".{audio_format}")
    tmp_audio_path = tmp_audio_file.name
    tmp_audio_file.close()  # Close so ffmpeg can write to it

    try:
        # Use ffmpeg to extract audio
        (
            ffmpeg
            .input(video_file_path)
            .output(tmp_audio_path, format=audio_format, acodec='mp3', ac=1, ar='44100')
            .overwrite_output()
            .run(quiet=True)
        )
        return tmp_audio_path
    except Exception as e:
        if os.path.exists(tmp_audio_path):
            os.remove(tmp_audio_path)
        raise RuntimeError(f"Audio extraction failed: {e}")
