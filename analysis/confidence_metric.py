def compute_overall_confidence(result):
    base_conf = result.get("confidence_score", 0)
    eye_contact = result.get("eye_contact_score", 0)
    smile_count = result.get("smile_count", 0)
    emotion = result.get("dominant_emotion", "neutral")

    # ✅ 1. Adaptive Smile Engagement Score (based on percentage of total frames)
    # Smooth scaling instead of hard thresholds
    smile_engagement = min(100, (smile_count / 60) * 100)  # assuming 60 smiles ≈ full engagement
    if smile_engagement < 30:
        smile_feedback = "Try smiling more often to appear friendly and engaged."
    elif smile_engagement < 70:
        smile_feedback = "Good balance of smiling — looks natural and confident."
    else:
        smile_feedback = "Excellent smile engagement! Very approachable and warm."

    # ✅ 2. Emotion-Based Bonus (more nuanced)
    emotion_weights = {
        "happy": 10,
        "neutral": 5,
        "surprise": 7,
        "sad": -5,
        "angry": -8,
        "fear": -10,
        "disgust": -8
    }
    emotion_bonus = emotion_weights.get(emotion, 0)

    # ✅ 3. Weighted Confidence Formula (balanced + interpretable)
    # You can tweak these weights based on testing
    overall = (
        (base_conf * 0.4) +      # base emotional steadiness
        (eye_contact * 0.3) +    # connection / presence
        (smile_engagement * 0.2) +  # warmth
        (emotion_bonus * 1.0)    # subtle boost for positive emotion
    )

    return {
        "final_confidence": round(min(overall, 100), 2),
        "smile_engagement_score": round(smile_engagement, 2),
        "smile_feedback": smile_feedback
    }
