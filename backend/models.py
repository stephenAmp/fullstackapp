from sqlalchemy import Column,String,Integer
from database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer,primary_key=True)
    username = Column(String(50))
    password = Column(String(50))


class Posts(Base):
    __tablename__ = 'posts'
    id = Column(Integer,primary_key=True)
    activity = Column(String(100))
    
