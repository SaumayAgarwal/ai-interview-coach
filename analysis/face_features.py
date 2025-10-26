import cv2
from fer import FER
import mediapipe as mp

def analyze_face(video_path):
    print("🎥 Video analysis started...")

    cap = cv2.VideoCapture(video_path)
    emotion_detector = FER(mtcnn=True)
    mp_face = mp.solutions.face_mesh
    face_mesh = mp_face.FaceMesh(static_image_mode=False, refine_landmarks=True)

    emotions_counter = {"angry":0, "disgust":0, "fear":0, "happy":0, "sad":0, "surprise":0, "neutral":0}
    smile_count = 0
    eye_contact_frames = 0
    total_frames = 0

    # 🧩 Adaptive frame skipping
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    duration = cap.get(cv2.CAP_PROP_FRAME_COUNT) / fps
    FRAME_SKIP = 5 if duration > 10 else 2  # analyze more frames if video is short
    BATCH_SIZE = 16

    frames_batch = []
    frame_idx = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame_idx += 1

        # Skip first few frames for face stabilization
        if frame_idx < 10:
            continue

        if frame_idx % FRAME_SKIP != 0:
            continue

        frames_batch.append(frame)
        total_frames += 1

        if len(frames_batch) >= BATCH_SIZE:
            smile_inc, eye_inc = process_batch(frames_batch, emotion_detector, face_mesh, emotions_counter)
            smile_count += smile_inc
            eye_contact_frames += eye_inc
            frames_batch = []

    # leftover frames
    if frames_batch:
        smile_inc, eye_inc = process_batch(frames_batch, emotion_detector, face_mesh, emotions_counter)
        smile_count += smile_inc
        eye_contact_frames += eye_inc

    cap.release()

    # ✅ Compute safe totals
    total_frames = max(total_frames, 1)
    dominant_emotion = max(emotions_counter, key=emotions_counter.get)
    non_negative = emotions_counter["happy"] + emotions_counter["neutral"] + emotions_counter["surprise"]

    confidence_score = round((non_negative / total_frames) * 10, 2)
    smile_engagement_score = round((smile_count / total_frames) * 100, 2)
    eye_contact_score = round((eye_contact_frames / total_frames) * 100, 2)

    # 🛡️ Fallback for very short or no detection cases
    if duration < 8 and eye_contact_score == 0:
        eye_contact_score = 30  # neutral default if too short to analyze properly

    print(f"✅ Video analysis finished. Duration: {duration:.2f}s, Frames analyzed: {total_frames}")

    return {
        "dominant_emotion": dominant_emotion,
        "confidence_score": confidence_score,
        "smile_count": smile_count,
        "smile_engagement_score": smile_engagement_score,
        "eye_contact_score": eye_contact_score
    }


def process_batch(frames, emotion_detector, face_mesh, emotions_counter):
    smile_count = 0
    eye_contact_frames = 0

    for frame in frames:
        # 🎭 Emotion detection
        result = emotion_detector.detect_emotions(frame)
        if result:
            emotions = result[0]["emotions"]
            top_emotion = max(emotions, key=emotions.get)
            emotions_counter[top_emotion] += 1

            if emotions.get("happy", 0) > 0.25:  # slightly lower threshold
                smile_count += 1

        # 👁️ Eye contact detection
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mesh_results = face_mesh.process(rgb)
        if mesh_results.multi_face_landmarks:
            for face_landmarks in mesh_results.multi_face_landmarks:
                left_eye = face_landmarks.landmark[33]
                right_eye = face_landmarks.landmark[263]
                # relaxed gaze window
                if 0.30 < left_eye.x < 0.70 and 0.30 < right_eye.x < 0.70:
                    eye_contact_frames += 1

    return smile_count, eye_contact_frames
