def generate_ai_feedback(confidence, eye_contact, emotion, smile):
    feedback = []

    # Confidence feedback
    if confidence < 40:
        feedback.append("You appeared a bit reserved. Try projecting more confidence with posture and tone.")
    elif confidence < 70:
        feedback.append("You showed decent confidence, but a bit more energy and engagement will help.")
    else:
        feedback.append("Excellent confidence! You appear self-assured and professional.")

    # Eye contact feedback
    if eye_contact < 60:
        feedback.append("Maintain steadier eye contact to appear more focused and assertive.")
    elif eye_contact < 80:
        feedback.append("Good eye contact — just a bit more consistency can make a strong impression.")
    else:
        feedback.append("Great eye contact — you stay connected with your audience naturally.")

    # Emotion feedback
    if emotion == "neutral":
        feedback.append("You remained calm, but try adding small expressions to appear more engaged.")
    elif emotion == "happy":
        feedback.append("Positive expression! You appear friendly and approachable.")
    else:
        feedback.append(f"Detected emotion '{emotion}'. Try to maintain a calm, positive demeanor.")

    # Smile feedback
    if smile < 40:
        feedback.append("Smiling occasionally can make you look more approachable.")
    elif smile < 80:
        feedback.append("Good smiling — shows warmth without overdoing it.")
    else:
        feedback.append("Excellent smile engagement! You appear very approachable.")

    return " ".join(feedback)
