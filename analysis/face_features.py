import random

def analyze_face(video_path):
    """
    Analyze a video and extract facial metrics for AI Interview Coach.
    Returns a dictionary with all key fields.
    """

    # --- Dummy logic for demonstration ---
    # In real implementation, use FER or OpenCV or dlib to extract these

    # Example: dominant emotion detection
    emotions = ["neutral", "happy", "sad", "angry", "surprised"]
    dominant_emotion = random.choice(emotions)

    # Confidence score based on facial analysis (scale 1-10)
    confidence_score = round(random.uniform(4.0, 7.0), 2)

    # Eye contact score (percentage)
    eye_contact_score = round(random.uniform(50, 90), 2)

    # Smile count (total smiles detected)
    smile_count = random.randint(50, 120)

    return {
        "dominant_emotion": dominant_emotion,
        "confidence_score": confidence_score,
        "eye_contact_score": eye_contact_score,
        "smile_count": smile_count
    }
