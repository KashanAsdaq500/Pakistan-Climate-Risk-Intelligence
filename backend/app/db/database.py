from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings, BACKEND_DIR

db_url = settings.DATABASE_URL
connect_args = {}

if db_url.startswith("sqlite:///./"):
    # Normalize relative sqlite path to always live inside backend directory
    rel_file = db_url.replace("sqlite:///./", "")
    abs_db_path = (BACKEND_DIR / rel_file).resolve()
    db_url = f"sqlite:///{abs_db_path.as_posix()}"
    connect_args["check_same_thread"] = False
elif db_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    db_url,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from app.db import models  # Ensure all model tables are registered in Base.metadata
    Base.metadata.create_all(bind=engine)
