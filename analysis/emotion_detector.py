from fer import FER
import cv2

def analyze_video(video_path):
    detector = FER(mtcnn=True)
    cap = cv2.VideoCapture(video_path)
    frame_count, emotions = 0, []

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame_count += 1
        if frame_count % 10 == 0:  # every 10th frame
            results = detector.detect_emotions(frame)
            if results:
                emotions.append(results[0]['emotions'])
    cap.release()
    return emotions
