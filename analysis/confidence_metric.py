def compute_overall_confidence(result):
    base_conf = result.get("confidence_score", 0)
    eye_contact = result.get("eye_contact_score", 0)
    smile_count = result.get("smile_count", 0)
    emotion = result.get("dominant_emotion", "neutral")

    # ✅ Convert smile_count into Smile Engagement Score (0–100)
    if smile_count <= 10:
        smile_engagement = 30
        smile_feedback = "Try smiling more often to appear friendly."
    elif smile_count <= 40:
        smile_engagement = 60
        smile_feedback = "Good balance of smiling; appears natural."
    else:
        smile_engagement = 90
        smile_feedback = "Excellent smile engagement! Very approachable."

    # Emotion-based bonus
    if emotion == "happy":
        emotion_bonus = 10
    elif emotion == "neutral":
        emotion_bonus = 5
    else:
        emotion_bonus = 0

    # Weighted final score
    overall = (
        (base_conf * 0.4)
        + (eye_contact * 0.3)
        + (smile_engagement * 0.2)
        + (emotion_bonus * 0.1)
    )

    return {
        "final_confidence": round(min(overall, 100), 2),
        "smile_engagement_score": smile_engagement,
        "smile_feedback": smile_feedback
    }

