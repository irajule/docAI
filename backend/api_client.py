import requests
import time
from app.config import API_KEY

def call_together_ai(prompt: str, max_tokens: int = 1000, retries=3, backoff=5) -> str:
    for attempt in range(retries):
        try:
            response = requests.post(
                "https://api.together.ai/v1/completions",
                headers={"Authorization": f"Bearer {API_KEY}"},
                json={
                    "model": "lgai/exaone-3-5-32b-instruct",
                    "prompt": prompt,
                    "max_tokens": max_tokens,
                    "temperature": 0.3
                },
                timeout=60
            )
            if response.status_code == 200:
                return response.json().get("choices", [{}])[0].get("text", "").strip() or "No response"
            elif response.status_code in [429, 503, 504]:
                time.sleep(backoff * (attempt + 1))
            else:
                return f"API Error: {response.status_code} - {response.text}"
        except Exception as e:
            if attempt == retries - 1:
                return f"Exception: {str(e)}"
            time.sleep(backoff * (attempt + 1))
    return "Request failed after multiple attempts."
