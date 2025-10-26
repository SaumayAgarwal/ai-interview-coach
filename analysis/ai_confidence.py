# analysis/ai_confidence.py
import cv2, base64, os, json, re
from openai import OpenAI


def sample_frames(video_path, num_samples=3):
    """Extract a few evenly spaced frames and return them as base64 strings."""
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frames = []

    for i in range(num_samples):
        frame_idx = int(total_frames * (i + 1) / (num_samples + 1))
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
        ret, frame = cap.read()
        if ret:
            # Resize small to reduce token size and cost
            frame = cv2.resize(frame, (480, 270))
            _, buf = cv2.imencode(".jpg", frame)
            frames.append(base64.b64encode(buf).decode("utf-8"))
    cap.release()
    return frames


def analyze_confidence_with_ai(video_path):
    """Use GPT-4o-mini to rate visual confidence and return JSON."""
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    frames = sample_frames(video_path)

    if not frames:
        return {
            "ai_confidence_score": None,
            "ai_confidence_feedback": "No frames extracted for AI analysis.",
        }

    messages = [
        {
            "role": "system",
            "content": "You are an expert interview coach evaluating a candidate’s confidence based on short video clips.",
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": (
                        "Look at these images taken from a candidate's mock interview. "
                        "Rate their visual confidence (0–100) based on posture, eye contact, and facial expression. "
                        "Return a JSON object like this:\n"
                        "{\"ai_confidence_score\": 85, \"ai_confidence_feedback\": \"Short 2-sentence feedback.\"}"
                    ),
                },
                *[
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img}"}}
                    for img in frames
                ],
            ],
        },
    ]

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=200,
            temperature=0.5,
        )

        content = response.choices[0].message.content.strip()
        match = re.search(r"\{.*\}", content, re.DOTALL)

        if match:
            return json.loads(match.group(0))
        else:
            return {
                "ai_confidence_score": None,
                "ai_confidence_feedback": content or "No structured feedback returned.",
            }

    except Exception as e:
        print("AI confidence analysis error:", e)
        return {
            "ai_confidence_score": None,
            "ai_confidence_feedback": "Could not analyze confidence due to API error.",
        }
