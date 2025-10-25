import cv2
from fer import FER
import mediapipe as mp
import numpy as np

def analyze_face(video_path):
    print("Video analysis started...")

    # Initialize detectors
    cap = cv2.VideoCapture(video_path)
    emotion_detector = FER(mtcnn=True)
    mp_face = mp.solutions.face_mesh
    face_mesh = mp_face.FaceMesh(static_image_mode=False)

    emotions_counter = {"angry":0, "disgust":0, "fear":0, "happy":0, "sad":0, "surprise":0, "neutral":0}
    smile_count = 0
    eye_contact_frames = 0
    total_frames = 0

    # 🧩 Sample every Nth frame for faster analysis
    FRAME_SKIP = 5  # analyze 1 in every 5 frames → ~6 fps if 30fps video
    frame_idx = 0

    frames_batch = []
    batch_size = 16  # how many frames to process at once

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame_idx += 1

        # Skip frames for speed
        if frame_idx % FRAME_SKIP != 0:
            continue

        frames_batch.append(frame)
        total_frames += 1

        # 🔄 Process in small batches to reduce model overhead
        if len(frames_batch) >= batch_size:
            process_batch(frames_batch, emotion_detector, face_mesh, emotions_counter,
                          lambda: increment_eye_contact(frames_batch, face_mesh),
                          lambda: count_smiles(frames_batch, emotion_detector))
            frames_batch = []  # clear batch

    # process leftover frames
    if frames_batch:
        process_batch(frames_batch, emotion_detector, face_mesh, emotions_counter,
                      lambda: increment_eye_contact(frames_batch, face_mesh),
                      lambda: count_smiles(frames_batch, emotion_detector))

    cap.release()

    # ✅ Compute metrics
    dominant_emotion = max(emotions_counter, key=emotions_counter.get)
    non_negative = emotions_counter["happy"] + emotions_counter["neutral"] + emotions_counter["surprise"]
    confidence_score = round((non_negative / total_frames) * 10, 2) if total_frames else 0
    smile_engagement_score = round((smile_count / total_frames) * 100, 2) if total_frames else 0
    eye_contact_score = round((eye_contact_frames / total_frames) * 100, 2) if total_frames else 0

    print("Video analysis finished.")

    return {
        "dominant_emotion": dominant_emotion,
        "confidence_score": confidence_score,
        "smile_count": smile_count,
        "smile_engagement_score": smile_engagement_score,
        "eye_contact_score": eye_contact_score
    }


# 🧠 Helper: Process a batch of frames at once
def process_batch(frames, emotion_detector, face_mesh, emotions_counter, eye_contact_fn, smile_fn):
    # Batch emotion analysis
    for frame in frames:
        result = emotion_detector.detect_emotions(frame)
        if result:
            top_emotion = max(result[0]["emotions"], key=result[0]["emotions"].get)
            emotions_counter[top_emotion] += 1

# 🧩 Helper: Count smile frames
def count_smiles(frames, emotion_detector):
    smile_count = 0
    for frame in frames:
        result = emotion_detector.detect_emotions(frame)
        if result and result[0]["emotions"]["happy"] > 0.5:
            smile_count += 1
    return smile_count

# 👁️ Helper: Eye contact approximation
def increment_eye_contact(frames, face_mesh):
    eye_contact_frames = 0
    for frame in frames:
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mesh_results = face_mesh.process(rgb_frame)
        if mesh_results.multi_face_landmarks:
            for face_landmarks in mesh_results.multi_face_landmarks:
                left_eye = face_landmarks.landmark[33]
                right_eye = face_landmarks.landmark[263]
                if 0.4 < left_eye.x < 0.6 and 0.4 < right_eye.x < 0.6:
                    eye_contact_frames += 1
    return eye_contact_frames
