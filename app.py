from flask import Flask, request, jsonify
import os
from analysis.emotion_detector import analyze_video
from analysis.summarize import summarize_emotions
from analysis.face_features import analyze_face_features
from analysis.confidence_metric import compute_overall_confidence


app = Flask(__name__)
UPLOAD_FOLDER = "temp"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/analyzeVideo', methods=['POST'])
def analyze_video_api():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    video = request.files['file']
    video_path = os.path.join(UPLOAD_FOLDER, video.filename)
    video.save(video_path)

    emotions = analyze_video(video_path)
    emotion_summary = summarize_emotions(emotions)
    face_features = analyze_face_features(video_path)

    # Merge both results
    result = {**emotion_summary, **face_features}

    # 🔹 Add final interview confidence score
    result.update(compute_overall_confidence(result))

    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5001, debug=True)

