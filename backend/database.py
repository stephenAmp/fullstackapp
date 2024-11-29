from sqlalchemy import create_engine;
from sqlalchemy.orm import sessionmaker;
from sqlalchemy.ext.declarative import declarative_base;
import os
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv('DB_URL')
engine = create_engine(DB_URL)
sessionLocal = sessionmaker(autocommit=False,autoflush=False,bind = engine)
Base = declarative_base()