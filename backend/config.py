import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("TOGETHER_API_KEY")
if not API_KEY:
    raise ValueError("TOGETHER_API_KEY not set in environment")
