from flask import Flask, request, jsonify
from analysis.emotion_detector import analyze_video
from analysis.face_features import analyze_face
from analysis.confidence_metric import compute_overall_confidence
from analysis.emotion_timeline import plot_emotion_timeline
from analysis.ai_confidence import analyze_combined_ai_feedback  # ✅ correct import
from dotenv import load_dotenv
import os, base64

# Load environment variables
load_dotenv()

app = Flask(__name__)

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY not set! Add it to your .env file.")

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
        # 1️⃣ Analyze emotions (frame-based)
        timeline = analyze_video(video_path)

        # 2️⃣ Generate emotion timeline image
        timeline_img_path = os.path.join(UPLOAD_FOLDER, "emotion_timeline.png")
        plot_emotion_timeline(timeline, timeline_img_path)

        # 3️⃣ Convert timeline image to base64
        with open(timeline_img_path, "rb") as f:
            encoded_timeline = base64.b64encode(f.read()).decode("utf-8")

        # 4️⃣ Analyze face features (eye contact, emotion, smile count)
        face_features = analyze_face(video_path)

        # 5️⃣ Compute rule-based confidence metrics
        confidence_metrics = compute_overall_confidence(face_features)

        # 6️⃣ Prepare metrics for combined AI feedback
        metrics_for_ai = {
            "rule_confidence": confidence_metrics.pop("final_confidence", 0),
            "eye_contact_score": face_features.get("eye_contact_score"),
            "dominant_emotion": face_features.get("dominant_emotion"),
            "smile_engagement_score": confidence_metrics.get("smile_engagement_score"),
            "smile_count": face_features.get("smile_count"),
        }

        # 7️⃣ AI-based combined confidence + feedback (single GPT call)
        ai_result = analyze_combined_ai_feedback(video_path, metrics_for_ai)
        ai_conf = ai_result.get("ai_confidence_score", 0)
        ai_feedback = ai_result.get("ai_confidence_feedback", "AI feedback unavailable.")
        ai_overall_feedback = ai_result.get("ai_overall_feedback", {})

        # 8️⃣ Blend AI and rule-based confidence
        ai_conf = ai_result.get("ai_confidence_score") or 0
        rule_conf = confidence_metrics.get("final_confidence") or 0

        # Blend AI and rule-based confidence
        final_confidence = round((0.6 * ai_conf + 0.4 * rule_conf), 2)

        # 9️⃣ Build final structured response
        result = {
                    # Emotion and eye contact
                    "dominant_emotion": face_features.get("dominant_emotion"),
                    "emotion_timeline_image": encoded_timeline,
                    "eye_contact_score": round(face_features.get("eye_contact_score", 0), 2),

                    # Smile analysis
                    "smile_engagement_score": round(confidence_metrics.get("smile_engagement_score", 0), 2),
                    "smile_feedback": confidence_metrics.get("smile_feedback"),

                    # Confidence
                    "ai_confidence_score": round(ai_conf, 2),
                    "rule_based_confidence": round(metrics_for_ai.get("rule_confidence", 0), 2),
                    "final_confidence": round(final_confidence, 2),

                    # AI feedback
                    "ai_overall_feedback": (
                        ai_feedback.get("ai_overall_feedback", {})
                        if isinstance(ai_feedback, dict)
                        else {"summary": ai_feedback}
                    )
                }


        return jsonify(result)

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/ping")
def ping():
    return "Server is running fine!"


if __name__ == "__main__":
    app.run(debug=True, port=5001)
