
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import numpy as np
from orm_model import User

from flask_migrate import Migrate
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, User


# Example of getting a variable from the .env file

load_dotenv()
app = Flask(__name__)   
CORS(app)


some_variable = os.getenv('PG_DATABASE_URL')

engine = create_engine(some_variable)
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)




#! Routes for Authentication
@app.route('/signup', methods=['POST'])
def signup():
    session = Session()
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"error": "Name, email and password are required."}), 400

    if session.query(User).filter_by(email=email).first() or session.query(User).filter_by(name=name).first():
        return jsonify({"error": "User with this name or email already exists."}), 400

    new_user = User(name=name, email=email, password=password)
    session.add(new_user)
    session.commit()
    session.close()
    return jsonify({"message": "User created successfully."}), 201

@app.route('/login', methods=['POST'])
def login():
    session = Session()
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')

    if not name or not email:
        return jsonify({"error": "Name and email are required."}), 400

    user = session.query(User).filter_by(name=name, email=email).first()
    session.close()
    if not user:
        return jsonify({"error": "Invalid credentials."}), 401

    return jsonify({"message": "Login successful.", "user_id": user.id}), 200




#! Routes for Frame Processing ...  
@app.route('/<name>',methods=['POST','GET'])
def hello_api(name):
    return f'Hello {name}.'

@app.route('/process_frame', methods=['POST'])
def process_frame_route():
    data = request.json
    student_id = data.get("student_id")
    frame = data.get("frame")
    modi_frame = np.array(frame, dtype=np.uint8)
    process_frame(frame=modi_frame, studentId=student_id)
    return {"message": "Frame processed"}

@app.route('/end_process', methods=['GET'])
def end_process_route():
    student_id = request.args.get('student_id')
    return end_process(studentId=student_id)
    


















if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
