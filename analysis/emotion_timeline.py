import matplotlib
matplotlib.use("Agg")  # ✅ Use a non-GUI backend — prevents Tkinter thread errors
import matplotlib.pyplot as plt

# Assign each emotion a numeric value for plotting
EMOTION_MAP = {
    "angry": 0, "disgust": 1, "fear": 2, "happy": 3,
    "neutral": 4, "sad": 5, "surprise": 6
}

def plot_emotion_timeline(timeline, output_path="temp/emotion_timeline.png"):
    if not timeline:
        return None
    times = [t for t, _ in timeline]
    values = [EMOTION_MAP.get(e, 4) for _, e in timeline]

    plt.figure(figsize=(8, 4))
    plt.plot(times, values, color="blue", linewidth=2)
    plt.yticks(list(EMOTION_MAP.values()), list(EMOTION_MAP.keys()))
    plt.xlabel("Time (seconds)")
    plt.ylabel("Emotion")
    plt.title("Emotion Timeline")
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()
    return output_path
