from flask import Flask, request, jsonify
from analysis.emotion_detector import analyze_video        # returns [(time, emotion)]
from analysis.face_features import analyze_face            # returns confidence_score, eye_contact_score, smile_count, dominant_emotion
from analysis.confidence_metric import compute_overall_confidence
from analysis.emotion_timeline import plot_emotion_timeline
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
import os, base64

# Load environment variables if needed
# from dotenv import load_dotenv
# load_dotenv()

app = Flask(__name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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

        # 2️⃣ Generate timeline image
        timeline_img_path = os.path.join(UPLOAD_FOLDER, "emotion_timeline.png")
        plot_emotion_timeline(timeline, timeline_img_path)

        # 3️⃣ Convert image to Base64
        with open(timeline_img_path, "rb") as f:
            encoded_timeline = base64.b64encode(f.read()).decode("utf-8")

        # 4️⃣ Analyze face features
        print("Video analysis started")
        face_features = analyze_face(video_path)
        print("Video analysis finished")

        # 5️⃣ Compute final confidence metrics
        confidence_metrics = compute_overall_confidence(face_features)

        # 6️⃣ Merge all results
        result = {**face_features, **confidence_metrics, "emotion_timeline_image": encoded_timeline}

        # 7️⃣ AI-generated feedback using OpenAI
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
                    temperature=0
                )

                feedback = response.choices[0].message.content.strip()
                return feedback

            except Exception as e:
                print("OpenAI API Error:", e)
                return "AI feedback unavailable. Try again later."

        # Generate feedback dynamically
        ai_feedback = generate_ai_feedback(
            confidence_metrics["final_confidence"],
            face_features["eye_contact_score"],
            face_features["dominant_emotion"],
            confidence_metrics["smile_engagement_score"]
        )

        result["ai_feedback"] = ai_feedback

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/ping")
def ping():
    return "Server is running fine!"


if __name__ == "__main__":
    app.run(debug=True, port=5001)


