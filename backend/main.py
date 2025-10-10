from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import cv_routes, qa_routes, translate_routes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(cv_routes.router)
app.include_router(qa_routes.router)
app.include_router(translate_routes.router)
