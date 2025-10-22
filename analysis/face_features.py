import cv2

def analyze_face_features(video_path):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')

    cap = cv2.VideoCapture(video_path)
    eye_frames, smile_count = 0, 0
    total_frames = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        total_frames += 1
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        for (x, y, w, h) in faces:
            roi = gray[y:y+h, x:x+w]
            eyes = eye_cascade.detectMultiScale(roi)
            smiles = smile_cascade.detectMultiScale(roi, 1.7, 20)
            if len(eyes) >= 2:
                eye_frames += 1
            if len(smiles) > 0:
                smile_count += 1

    cap.release()
    eye_contact_score = round((eye_frames / total_frames) * 100, 2) if total_frames else 0
    return {"eye_contact_score": eye_contact_score, "smile_count": smile_count}
