# nlp_analysis.py
import re
import json
import os
from transformers import pipeline
from openai import OpenAI
from textblob import TextBlob

# Initialize models
sentiment_model = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

emotion_model = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=None
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Filler patterns
filler_patterns = [
    r"\bum\b", r"\buh\b", r"\bhmm\b", r"\ber\b", r"\bah\b",
    r"\blike\b", r"\byou know\b", r"\bactually\b", r"\bso\b",
    r"\bwell\b", r"\bi mean\b", r"\bsort of\b", r"\bkind of\b",
    r"\bright\b", r"\bokay\b", r"\byou see\b", r"\bkinda\b", r"\bsorta\b"
]

compiled_fillers = [re.compile(p, re.IGNORECASE) for p in filler_patterns]

# Analysis function
def analyze_interview_text_simple(text: str) -> dict:
    """Hybrid AI + Rule-based NLP analysis for confidence scoring"""
    
    text_clean = re.sub(r'\s+', ' ', text.strip())
    words = re.findall(r"\b\w+\b", text_clean)
    
    # Filler analysis
    filler_count = sum(len(p.findall(text_clean)) for p in compiled_fillers)
    filler_ratio = filler_count / max(len(words), 2)
    
    # Sentiment analysis
    sentiment_raw = sentiment_model(text_clean[:512])[0]
    sentiment_label = sentiment_raw["label"].lower()
    
    # Emotion analysis
    emotion_results = emotion_model(text_clean[:512])[0]
    dominant_emotion = max(emotion_results, key=lambda x: x["score"])
    emotion_label = dominant_emotion["label"]
    
    # Fluency score
    blob = TextBlob(text)
    fluency_score = (1 - abs(blob.sentiment.subjectivity - 0.5)) * 10  
    fluency_score = round(fluency_score * 10, 2)  
     
    # Rule-based confidence
    base_conf = 7.0 if sentiment_label == "positive" else 5.0
    rule_confidence = round(max(1, base_conf - filler_ratio * 20 + fluency_score / 10), 2)
    
    # AI confidence via OpenAI
    ai_prompt = f"""
    You are an expert AI communication coach.
    Analyze this candidate's spoken interview response.

    Response:
    "{text}"

    Evaluate:
    - Confidence level (0 to 100)
    - Emotional tone
    - Vocal style
    - Provide short feedback paragraph

    Respond ONLY in JSON:
    {{
        "ai_confidence": <number>,
        "dominant_tone": "<string>",
        "ai_feedback": "<string>"
    }}
    """
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": ai_prompt}],
        temperature=0.7
    )
    
    try:
        ai_data = json.loads(response.choices[0].message.content)
    except:
        ai_data = {
            "ai_confidence": 6.5,
            "dominant_tone": "neutral",
            "ai_feedback": "AI feedback unavailable."
        }
    
    ai_confidence = ai_data.get("ai_confidence", 6.5)
    ai_confidence = round(ai_confidence , 2)  
    
    # Final confidence fusion
    final_confidence = round((0.6 * ai_confidence + 0.4 * rule_confidence), 2)
    final_confidence = round(final_confidence , 2)
    return {
        "word_count": len(words),
        "filler_count": filler_count,
        "sentiment": sentiment_label,
        "dominant_emotion": emotion_label,
        "fluency_score": fluency_score,
        "ai_confidence": ai_confidence,
        "final_confidence": final_confidence,
        "ai_feedback": ai_data.get("ai_feedback", "No feedback generated.")
    }
