from fastapi import APIRouter, UploadFile, Form
from typing import List
from app.file_utils import extract_text_from_file
from app.api_client import call_together_ai
from app.llm_utils import clean_llm_output
from app.prompts import load_prompt

router = APIRouter()

@router.post("/cvscreen")
async def match_candidates(files: List[UploadFile], job_description: str = Form(...)):
    results = []

    for file in files:
        contents = await file.read()
        resume_text = extract_text_from_file(file, contents)
        prompt_template = load_prompt("cv_screen_prompt.txt")
        prompt = prompt_template.format(job_description=job_description, resume_text=resume_text)
        raw_answer = call_together_ai(prompt, max_tokens=2000)
        cleaned = clean_llm_output(raw_answer)

        results.append({
            "filename": file.filename,
            "match": cleaned
        })

    return {"results": results}
