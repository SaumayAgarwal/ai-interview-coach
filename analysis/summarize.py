import numpy as np

def summarize_emotions(emotions):
    if not emotions:
        return {"dominant_emotion": "neutral", "confidence_score": 0.0}
    avg = {k: np.mean([e[k] for e in emotions]) for k in emotions[0]}
    dominant = max(avg, key=avg.get)
    confidence_score = avg.get('happy', 0) * 100
    return {
        "dominant_emotion": dominant,
        "confidence_score": round(confidence_score, 2)
    }
