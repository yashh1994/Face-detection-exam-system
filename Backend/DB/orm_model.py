from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from passlib.context import CryptContext

Base = declarative_base()

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
        return f"<User(name='{self.name}', email='{self.email}')>"

    @staticmethod
    def hash_password(password):
        pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto")
        return pwd_context.hash(password)

    def varify_password(self,password):
        pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto")
        return pwd_context.verify(password,self.password)
    

