from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from passlib.context import CryptContext
from sqlalchemy.dialects.postgresql import ARRAY,JSONB
from sqlalchemy.orm import relationship

Base = declarative_base()

class Test(Base):
    __tablename__ = 'Tests'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    duration = Column(Integer, nullable=False)
    description = Column(String, nullable=True)
    start_time = Column(String, nullable=False)  # Consider using DateTime for proper time handling
    end_time = Column(String, nullable=False)    # Same as above
    user_id = Column(Integer, ForeignKey('Users.id'), nullable=False)
    questions = Column(ARRAY(JSONB), nullable=False)

    def __init__(self, title, duration, description, start_time, end_time, user_id,question = None):
        self.title = title
        self.duration = duration
        self.description = description
        self.start_time = start_time
        self.end_time = end_time
        self.user_id = user_id
        self.questions = question or []

    def __repr__(self):
        return f"<Test(title='{self.title}', duration='{self.duration}', start_time='{self.start_time}', end_time='{self.end_time}', user_id='{self.user_id}')>"



class User(Base):
    __tablename__ = 'Users'

    id = Column(Integer, primary_key=True)
    name = Column(String(80),nullable=False)
    email = Column(String(120),nullable=False,unique=True)
    password = Column(String(128),nullable=False)

    def __init__(self,name,email,password):
        self.name = name
        self.email = email
        self.password = self.hash_password(password)
    
    def __repr__(self):
        return f"<User(name={self.name}, email={self.email})>"

    @staticmethod
    def hash_password(password):
        pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto")
        return pwd_context.hash(password)

    def varify_password(self,password):
        pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto")
        return pwd_context.verify(password,self.password)
    

