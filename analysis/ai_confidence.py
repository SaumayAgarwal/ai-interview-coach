# analysis/ai_feedback_combined.py
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
            frame = cv2.resize(frame, (480, 270))
            _, buf = cv2.imencode(".jpg", frame)
            frames.append(base64.b64encode(buf).decode("utf-8"))
    cap.release()
    return frames


def analyze_combined_ai_feedback(video_path, metrics):
    """
    Combines visual (frames) and numerical metrics into one GPT call.
    Returns a structured JSON feedback.
    """
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    frames = sample_frames(video_path)

    # Compose multimodal prompt
    user_content = [
        {
            "type": "text",
            "text": f"""
You are an expert AI interview coach.
You are analyzing a candidate's performance using both video frames and numerical metrics.

Here are the metrics:
- Confidence score (rule-based): {metrics.get("rule_confidence")}
- Eye contact score: {metrics.get("eye_contact_score")}
- Dominant emotion: {metrics.get("dominant_emotion")}
- Smile engagement score: {metrics.get("smile_engagement_score")}
- Smile count: {metrics.get("smile_count")}

Evaluate the candidate’s visual confidence, approachability, and communication effectiveness.

Return JSON only, structured like this:
{{
  "ai_confidence_score": 0-100,
  "ai_confidence_feedback": "Short, human-like feedback (2 sentences)",
  "ai_overall_feedback": {{
      "summary": "1-2 lines summary",
      "strengths": ["..."],
      "improvements": ["..."],
      "final_score": 0-100
  }}
}}
"""
        }
    ]

    # Add frames for multimodal context
    user_content.extend(
        [{"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img}"}} for img in frames]
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": user_content}],
            max_tokens=400,
            temperature=0.6,
        )

        content = response.choices[0].message.content.strip()
        match = re.search(r"\{.*\}", content, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        else:
            return {
                "ai_confidence_score": None,
                "ai_confidence_feedback": "No structured feedback returned.",
                "ai_overall_feedback": content,
            }

    except Exception as e:
        print("Combined AI feedback error:", e)
        return {
            "ai_confidence_score": None,
            "ai_confidence_feedback": "Error generating AI feedback.",
        }
