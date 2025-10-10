from fastapi import APIRouter, UploadFile, Form, File
from app.file_utils import extract_text_from_file
from app.api_client import call_together_ai
from app.prompts import load_prompt

router = APIRouter()

@router.post("/translate")
async def translate_document(file: UploadFile = File(...), source_lang: str = Form(...), target_lang: str = Form(...)):
    contents = await file.read()
    text = extract_text_from_file(file, contents)

    prompt_template = load_prompt("translate_prompt.txt")
    prompt = prompt_template.format(source_lang=source_lang, target_lang=target_lang, text=text)

    translated = call_together_ai(prompt, max_tokens=2000)
    return {"translation": translated}
