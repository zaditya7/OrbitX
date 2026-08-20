from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import engine
from .routers import auth, users

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="OrbitX API")

# Dev-friendly: allows any localhost port (Vite sometimes picks 5173, 5174, 5175...).
# Tighten this to your real frontend origin before deploying anywhere.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://orbit-x-omega.vercel.app",  # replace with your real Vercel URL
    ],
    allow_origin_regex=r"http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)


@app.get("/")
def root():
    return {"status": "OrbitX API running"}