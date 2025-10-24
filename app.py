from flask import Flask, request, jsonify
from analysis.emotion_detector import analyze_video        # returns [(time, emotion)]
from analysis.face_features import analyze_face            # returns confidence_score, eye_contact_score, smile_count, dominant_emotion
from analysis.confidence_metric import compute_overall_confidence
from analysis.emotion_timeline import plot_emotion_timeline
import os, base64

app = Flask(__name__)

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
        # 1️⃣ analyze emotions frame-by-frame
        timeline = analyze_video(video_path)

        # 2️⃣ generate timeline image
        timeline_img_path = os.path.join(UPLOAD_FOLDER, "emotion_timeline.png")
        plot_emotion_timeline(timeline, timeline_img_path)

        # 3️⃣ convert image to Base64
        with open(timeline_img_path, "rb") as f:
            encoded_timeline = base64.b64encode(f.read()).decode("utf-8")

        # 4️⃣ analyze face features
        face_features = analyze_face(video_path)
        # Ensure dominant_emotion and confidence_score are included
        # Example: face_features = {
        #    "dominant_emotion": "neutral",
        #    "confidence_score": 5.4,
        #    "eye_contact_score": 64.23,
        #    "smile_count": 103
        # }

        # 5️⃣ compute final confidence metrics
        confidence_metrics = compute_overall_confidence(face_features)
        # Example: confidence_metrics = {
        #   "final_confidence": 39.6,
        #   "smile_engagement_score": 90,
        #   "smile_feedback": "Excellent smile engagement! Very approachable."
        # }

        # 6️⃣ Merge everything
        result = {**face_features, **confidence_metrics, "emotion_timeline_image": encoded_timeline}

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True, port=5001)

