from fastapi import APIRouter, UploadFile, Form, File
from app.file_utils import extract_text_from_file
from app.api_client import call_together_ai
from app.llm_utils import clean_llm_output
from app.prompts import load_prompt

router = APIRouter()

@router.post("/docqa")
async def ask_question(file: UploadFile = File(...), question: str = Form(...)):
    contents = await file.read()
    text = extract_text_from_file(file, contents)

    # Decide which template to use
    template_name = "doc_qa_prompt.txt"
    prompt_template = load_prompt(template_name)
    prompt = prompt_template.format(resume_text=text, question=question)

    raw_answer = call_together_ai(prompt, max_tokens=1000)
    cleaned = clean_llm_output(raw_answer)
    return {"answer": cleaned}
