from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import numpy as np
from DB.orm_model import Base, Test, User
from AI.model_process import end_process,process_frame 
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from Utils import encrypt_decrypt


# Example of getting a variable from the .env file

load_dotenv()
app = Flask(__name__)   
CORS(app)


PG_DB_URL = os.getenv('PG_DATABASE_URL')

engine = create_engine(PG_DB_URL)
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)


# Generate a key (you should save this securely to use for both encryption and decryption)
# Use this line only once to generate a key, then use the saved key below for actual encoding/decoding
# key = Fernet.generate_key()
# print("Generated Key:", key)

# Use the generated key here (replace with your actual key)

#! Routes for Adding the Tests
@app.route('/add-test/<user_id>', methods=['POST'])
def create_test(user_id):
    session = Session()
    data = request.get_json()
    
 # Create test instance
    try:
        t1 = Test(title=data['title'],duration= data['duration'],description= data['description'],start_time= data['start_time'],end_time= data['end_time'],user_id= user_id,question= data['questions'])
        session.add(t1)
        session.commit()
        
        # Generate open link
        test_id = t1.id
        open_link = encrypt_decrypt(str(test_id),action="encode")
        return jsonify({"message": "Test created successfully", "open_link": open_link}), 201
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()





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

    if session.query(User).filter_by(email=email).first():
        return jsonify({"error": "User with this name or email already exists."}), 400

    new_user = User(name=name, email=email, password=password)
    session.add(new_user)
    session.commit()
    session.close()
    return jsonify({"message": "User created successfully."}),200

@app.route('/login', methods=['POST'])
def login():
    session = Session()
    data = request.get_json()
    email = data.get('email')  # Assume email is used for login
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = session.query(User).filter_by(email=email).first()
    session.close()
 
    if not user or not user.varify_password(password):
        return jsonify({"error": "Invalid credentials."}), 401
        
    return jsonify({
        "message": "Login successful.",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            # Add any other user info you want to return
        }
    }), 200




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
