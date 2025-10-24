from fer import FER
import cv2

def analyze_video(video_path):
    detector = FER(mtcnn=True)
    cap = cv2.VideoCapture(video_path)

    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = 0
    timeline = []  # (time, dominant_emotion)

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame_count += 1
        if frame_count % 10 == 0:  # every 10th frame
            results = detector.detect_emotions(frame)
            if results:
                emotions = results[0]['emotions']
                dominant = max(emotions, key=emotions.get)
                current_time = frame_count / fps
                timeline.append((current_time, dominant))
    cap.release()
    return timeline
