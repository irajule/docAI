import io
import mimetypes
import fitz  # PyMuPDF
from docx import Document
from fastapi import UploadFile

def extract_text_from_file(file: UploadFile, contents: bytes) -> str:
    mime_type, _ = mimetypes.guess_type(file.filename)
    ext = file.filename.lower().split('.')[-1]

    try:
        if mime_type == "application/pdf" or ext == "pdf":
            with fitz.open(stream=contents, filetype="pdf") as doc:
                return "\n".join([page.get_text() for page in doc])
        elif ext in ["docx", "doc"]:
            doc = Document(io.BytesIO(contents))
            return "\n".join([para.text for para in doc.paragraphs])
        elif ext == "txt":
            return contents.decode("utf-8", errors="ignore")
        else:
            return f"Unsupported file format: {file.filename}"
    except Exception as e:
        return f"Error extracting text from {file.filename}: {str(e)}"
