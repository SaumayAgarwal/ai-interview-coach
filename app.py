from flask import Flask, request, jsonify
from analysis.emotion_detector import analyze_video        # returns [(time, emotion)]
from analysis.face_features import analyze_face            # returns confidence_score, eye_contact_score, smile_count, dominant_emotion
from analysis.confidence_metric import compute_overall_confidence
from analysis.emotion_timeline import plot_emotion_timeline
from analysis.ai_confidence import analyze_confidence_with_ai
from openai import OpenAI
from dotenv import load_dotenv
import os, base64

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Get OpenAI API key
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY not set! Add it to your .env file.")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

UPLOAD_FOLDER = "temp"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/")
def home():
    return jsonify({"message": "AI Interview Coach API is running."})


@app.route("/analyzeVideo", methods=["POST"])
def analyze_video_route():
    if "video" not in request.files:
        return jsonify({"error": "No video file uploaded"}), 400

    file = request.files["video"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    video_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(video_path)

    try:
        # 1️⃣ Analyze emotions frame-by-frame
        timeline = analyze_video(video_path)

        # 2️⃣ Generate emotion timeline image
        timeline_img_path = os.path.join(UPLOAD_FOLDER, "emotion_timeline.png")
        plot_emotion_timeline(timeline, timeline_img_path)

        # 3️⃣ Convert timeline image to Base64
        with open(timeline_img_path, "rb") as f:
            encoded_timeline = base64.b64encode(f.read()).decode("utf-8")

        # 4️⃣ Analyze face features
        face_features = analyze_face(video_path)

        # 5️⃣ Compute rule-based confidence metrics
        confidence_metrics = compute_overall_confidence(face_features)

        # 6️⃣ AI-based visual confidence
        ai_confidence_result = analyze_confidence_with_ai(video_path)
        ai_conf = ai_confidence_result.get("ai_confidence_score", 0) or 0

        # Rename final_confidence to rule_based_confidence
        rule_conf = confidence_metrics.pop("final_confidence", 0)

        # Blend AI and rule-based confidence
        final_confidence = round((0.6 * ai_conf + 0.4 * rule_conf), 2)

        # 7️⃣ Generate AI feedback using OpenAI
        def generate_ai_feedback(confidence, eye_contact, emotion, smile):
            prompt = f"""
            You are an AI interview coach evaluating a candidate’s recorded mock interview.
            Use the following analysis data:
            - Confidence score: {confidence}
            - Eye contact score: {eye_contact}
            - Dominant emotion: {emotion}
            - Smile engagement score: {smile}

            Give short, personalized feedback (3–4 sentences).
            Be constructive and encouraging, like a professional human coach.
            """
            try:
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are an expert AI interview coach."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=150,
                    temperature=0.7
                )
                return response.choices[0].message.content.strip()
            except Exception as e:
                print("OpenAI API Error:", e)
                return "AI feedback unavailable. Try again later."

        ai_feedback = generate_ai_feedback(
            final_confidence,
            face_features["eye_contact_score"],
            face_features["dominant_emotion"],
            confidence_metrics["smile_engagement_score"]
        )

        # 8️⃣ Build ordered and clean JSON result
        result = {
            "dominant_emotion": face_features.get("dominant_emotion"),
            "emotion_timeline_image": encoded_timeline,
            "eye_contact_score": face_features.get("eye_contact_score"),
            "smile_count": face_features.get("smile_count"),
            "smile_engagement_score": confidence_metrics.get("smile_engagement_score"),
            "smile_feedback": confidence_metrics.get("smile_feedback"),
            "rule_based_confidence": rule_conf,
            "ai_confidence_score": ai_conf,
            "ai_confidence_feedback": ai_confidence_result.get("ai_confidence_feedback"),
            "final_confidence": final_confidence,
            "ai_feedback": ai_feedback
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/ping")
def ping():
    return "Server is running fine!"


if __name__ == "__main__":
    app.run(debug=True, port=5001)
