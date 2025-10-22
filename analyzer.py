# analyzer.py
import cv2
from fer import FER
import mediapipe as mp

# FER for frame-level emotion detection
detector = FER(mtcnn=True)

# MediaPipe for eye detection
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

def analyze_video(video_path, frame_skip=2):
    cap = cv2.VideoCapture(video_path)
    total_frames = 0
    smile_count = 0
    eye_contact_count = 0
    emotion_results = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        total_frames += 1
        if total_frames % frame_skip != 0:
            continue

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Emotion detection
        try:
            faces = detector.detect_emotions(rgb_frame)
            if faces:
                emotion_results.append(faces[0])
                if faces[0]['emotions'].get('happy', 0) > 0.5:
                    smile_count += 1
        except Exception as e:
            print("FER error:", e)
            continue

        # Eye contact detection
        mp_results = face_mesh.process(rgb_frame)
        if mp_results.multi_face_landmarks:
            face_landmarks = mp_results.multi_face_landmarks[0]
            left_eye = [face_landmarks.landmark[i] for i in range(33, 42)]
            right_eye = [face_landmarks.landmark[i] for i in range(133, 142)]
            left_ratio = abs(left_eye[1].y - left_eye[4].y)
            right_ratio = abs(right_eye[1].y - right_eye[4].y)
            if left_ratio > 0.02 and right_ratio > 0.02:
                eye_contact_count += 1

    cap.release()

    smile_percent = (smile_count / total_frames) * 100 if total_frames else 0
    eye_contact_percent = (eye_contact_count / total_frames) * 100 if total_frames else 0

    dominant_emotion = {}
    for r in emotion_results:
        for k, v in r["emotions"].items():
            dominant_emotion[k] = dominant_emotion.get(k, 0) + v
    dominant_emotion_name = max(dominant_emotion, key=dominant_emotion.get) if dominant_emotion else "neutral"
    confidence_score = sum(dominant_emotion.values()) / len(dominant_emotion) if dominant_emotion else 0

    return {
        "dominant_emotion": dominant_emotion_name,
        "smile_percent": smile_percent,
        "eye_contact_percent": eye_contact_percent,
        "confidence_score": confidence_score,
        "total_frames": total_frames
    }
