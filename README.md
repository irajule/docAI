# 📑 DocOps LLM Platform

## 1. Objective

DocOps LLM is a **document intelligence platform** with a **FastAPI backend** and a **React/Next.js frontend**.  
It leverages **Large Language Models (LLMs)** via **TogetherAI** to provide document operations such as:

- **📖 Document Q&A (DocQA):** Upload a document and ask natural-language questions about it.  
- **🌍 Document Translation:** Translate and summarize documents between languages.  
- **🧑‍💼 CV Screening:** Upload multiple CVs, provide a job description, and get **fit assessments, reasoning, and scores** for each candidate.  

The project runs with **Docker Compose**, combining backend, frontend, and Nginx into a unified deployable stack.

---

## 2. Tech Stack

- **Backend:** FastAPI, Python  
- **Frontend:** React / Next.js  
- **LLM Provider:** TogetherAI  
- **Parsing:** PyMuPDF, python-docx  
- **Deployment:** Docker + Docker Compose  
- **Reverse Proxy:** Nginx  

---

## 3. Features

- Multi-format **document parsing** (`.pdf`, `.docx`, `.txt`)  
- LLM-powered **question answering** over uploaded files  
- **Translation + summarization** of documents  
- **Automated CV screening** with structured reasoning & scores (0–100)  
- Modular **prompt templates** to tune LLM behavior  
- **Dockerized** setup for full-stack deployment  

---

## 4. Project Structure

```
project/
├─ backend/                 # FastAPI backend
│  ├─ app/
│  │   ├─ main.py
│  │   ├─ config.py
│  │   ├─ api_client.py
│  │   ├─ file_utils.py
│  │   ├─ llm_utils.py
│  │   ├─ prompts.py
│  │   ├─ routes/
│  │   └─ prompts/
│  ├─ requirements.txt
│  ├─ Dockerfile
│  └─ .env
│
├─ frontend/                # React / Next.js frontend
│  ├─ src/
│  ├─ package.json
│  └─ Dockerfile
│
├─ nginx/                   # Reverse proxy config
│  ├─ nginx.conf
│  └─ Dockerfile
│
└─ docker-compose.yml       # Orchestration for everything
```

---

## 5. Setup & Usage

### a. Prerequisites

- Docker & Docker Compose installed  
- TogetherAI API key (or another LLM provider)  

### b. Clone Repository

```bash
git clone https://github.com/yourusername/docops-llm.git
cd docops-llm
```

### c. Configure Backend Environment

Create a `.env` file inside `backend/`:

```env
TOGETHER_API_KEY=your_api_key_here
```

### d. Build & Run with Docker Compose

```bash
docker compose up --build
```

### e. Access Services

- **Frontend:** [http://localhost](http://localhost)  
- **Backend Swagger UI:** [http://localhost/api/docs](http://localhost/api/docs)  

---

## 6. API Endpoints

### 🔍 Document Q&A

**Endpoint:** `POST /api/docqa`  
Upload a file and ask natural-language questions.

```bash
curl -X POST "http://localhost/api/docqa"   -F "file=@resume.pdf"   -F "question=What is the candidate's total experience?"
```

---

### 🌍 Document Translation

**Endpoint:** `POST /api/translate`  
Translate and summarize uploaded documents.

```bash
curl -X POST "http://localhost/api/translate"   -F "file=@document.pdf"   -F "source_lang=English"   -F "target_lang=French"
```

---

### 🧑‍💼 CV Screening

**Endpoint:** `POST /api/cvscreen`  
Upload multiple CVs with a job description to get fit scores.

```bash
curl -X POST "http://localhost/api/cvscreen"   -F "files=@candidate1.pdf"   -F "files=@candidate2.docx"   -F "job_description=We are hiring a Python developer with 3+ years of experience"
```

**Example response:**

```json
{
  "results": [
    {
      "filename": "candidate1.pdf",
      "match": "Meets requirements: Yes",
      "score": 85,
      "reason": "Strong Python skills, 5+ years experience, good technical match"
    },
    {
      "filename": "candidate2.docx",
      "match": "Meets requirements: No",
      "score": 40,
      "reason": "Limited Python exposure, <1 year experience"
    }
  ]
}
```

---

## 7. Development Notes

- Frontend connects to backend via `/api` (proxied by Nginx).  
- Backend CORS settings allow frontend access during development.  
- Chunking and summarization ensure large document support.  
- CV scoring logic and prompts can be easily customized in `prompts.py`.  

---

## 8. Testing

- Use sample `.pdf` or `.docx` files for DocQA and Translation.  
- Unit tests can be added under `backend/tests/`.  
- Test with Postman or `curl` for API validation.  

---

## 9. Deployment

- Configure Nginx and SSL (Let's Encrypt).  
- Limit CORS origins for production.  
- Store secrets in environment variables or secret managers.  
- Add monitoring/logging for reliability (Grafana, Loki, Prometheus).  

---

## 10. Contributing

1. Fork this repo  
2. Create a new branch (`feature/awesome-feature`)  
3. Commit your changes  
4. Submit a pull request 🚀  

---

## 11. License

MIT License — free to use, modify, and distribute.

---

## 12. Author

**Developed by:** Jules Irabaruta 
📧 Contact: irajule@yahoo.com
🌐 GitHub: [https://github.com/yourusername](https://github.com/yourusername)
