from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import numpy as np
from DB.orm_model import Base, Test, User, ExamData
from AI.model_process import end_process,process_frame,check_position_frame
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


#! Routes for Getting already done exams
@app.route('/get-exam-data/<open_link>', methods=['GET'])
def get_exam_data(open_link):
    session = Session()
    try:
        test_id = encrypt_decrypt(data=open_link,action="decode")
        # Fetch the test details
        test_details = session.query(Test).filter_by(id=test_id).first()
        if not test_details:
            print("Test not found")
            return jsonify({"error": "Test not found"}), 404

        # Fetch all exam data for the test ID
        exam_data = session.query(ExamData).filter_by(test_id=test_id).all()
        if not exam_data:
            print("no data found for this test ID")
            return jsonify({"error": "No exam data found for this test ID"}), 404

        # Fetch all associated users in a single query
        user_ids = [data.user_id for data in exam_data]
        users = session.query(User).filter(User.id.in_(user_ids)).all()
        user_map = {user.id: user for user in users}  # Map user_id to user object

        # Compile student details
        students = []
        for data in exam_data:
            user = user_map.get(data.user_id)
            if user:  # Ensure user exists
                students.append({
                    "student_details": {
                        "id": user.id,
                        "name": user.name, 
                        "email":user.email # Assuming `User` has a `name` field
                    },
                    "score": data.score,
                    "start_time": data.start_time,
                    "monitoring_data": data.data  # Assuming `data` is JSON serializable
                })

        # Prepare the final response object
        final_exam_obj = {
            "test_details": {
                "id": test_details.id,
                "title": test_details.title,
                "description": test_details.description,
                "duration": test_details.duration,
                "start_time": test_details.start_time,
                "end_time": test_details.end_time,
            },
            "students": students,
        }

        return jsonify(final_exam_obj), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

    finally:
        session.close()

#! Route for Adding Exam Data
@app.route('/add-exam-data', methods=['POST'])
def add_exam_data():
    session = Session()
    data = request.get_json()
    user_id = data.get('user_id')
    test_id = data.get('test_id')
    score = data.get('score')
    start_time = data.get('start_time')
    exam_data = data['data']
    if not user_id or not test_id or score is None:
        return jsonify({"error": "User ID, Test ID, and score are required."}), 400

    try:
        new_exam_data = ExamData(user_id=user_id, test_id=test_id, score=score,start_time=start_time,data=exam_data)
        session.add(new_exam_data)
        session.commit()
        return jsonify({"message": "Exam data added successfully."}), 201
    except Exception as e:
        session.rollback()
        print("Error: ",str(e))
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()













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


@app.route('/get-test/<open_link>', methods=['GET'])
def get_test(open_link):
    session = Session()
    try:
        # Decode the open_link to get the test ID
        test_id = encrypt_decrypt(data=open_link, action="decode")
        
        # Fetch the test object from the database
        test = session.query(Test).filter_by(id=test_id).first()
        
        # Check if the test exists
        if test is None:
            return jsonify({"error": "Test not found"}), 404
        
        # Prepare the test data to return as JSON
        test_data = {
            "id": test.id,
            "title": test.title,
            "duration": test.duration,
            "description": test.description,
            "start_time": test.start_time,
            "end_time": test.end_time,
            "user_id": test.user_id,
            "questions": test.questions,
        }
        
        return jsonify(test_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()
    

@app.route('/get-my-test/<user_id>', methods=['GET'])
def get_my_test(user_id):
    session = Session()
    try:
        tests = session.query(Test).filter_by(user_id=str(user_id)).all()

        if not tests:
            return jsonify({"error": "Tests not found"}), 404
        
        tests_data = [
            {
                "id": test.id,
                "title": test.title,
                "duration": test.duration,
                "description": test.description,
                "start_time": test.start_time,
                "end_time": test.end_time,
                "user_id": test.user_id,
                "questions": test.questions,
                "open_link":encrypt_decrypt(data=str(test.id),action="encode")# Ensure `questions` is JSON serializable
  # Ensure `questions` is JSON serializable
            }
            for test in tests
        ]

        

        
        return jsonify(tests_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()


@app.route('/delete-test/<user_id>/<open_link>', methods=['DELETE'])
def delete_test(user_id, open_link):
    session = Session()

    try:
        # Decrypt the open_link to get the test_id
        test_id = encrypt_decrypt(open_link, action="decode")
        
        # Fetch the test from the database using the test_id
        test = session.query(Test).filter(Test.id == test_id, Test.user_id == user_id).first()

        # Check if the test exists and belongs to the user
        if not test:
            print("tst not found")
            return jsonify({"error": "Test not found or not authorized to delete"}), 404
        
        # Delete all exam data associated with the test
        exam_data = session.query(ExamData).filter_by(test_id=test_id).all()
        for data in exam_data:
            session.delete(data)
            
        # Delete the test
        session.delete(test)
        session.commit()

        return jsonify({"message": "Test deleted successfully"}), 200
    except Exception as e:
        session.rollback()
        print("Error: ",str(e))
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

@app.route('/get-given-tests/<user_id>', methods=['GET'])
def get_given_tests(user_id):
    session = Session()
    try:
        # Query all ExamData entries for the given user
        completed_exams = session.query(ExamData).filter_by(user_id=user_id).all()
        
        if not completed_exams:
            return jsonify({"error": "No completed exams found for this user"}), 404

        # Collect test information for each completed exam
        given_tests_data = []
        for exam in completed_exams:
            # Fetch associated test details from the Test table
            test = session.query(Test).filter_by(id=exam.test_id).first()
            if test:
                given_tests_data.append({
                    "exam_data_id": exam.id,
                    "test_id": test.id,
                    "title": test.title,
                    "duration": test.duration,
                    "description": test.description,
                    "start_time": test.start_time,
                    "end_time": test.end_time,
                    "user_id": test.user_id,
                    "questions": test.questions,
                    "exam_score": exam.score,
                    "exam_start_time": exam.start_time,
                    "exam_data": exam.data
                })

        return jsonify(given_tests_data), 200
    except Exception as e:
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
    
@app.route('/check-position', methods=['POST'])
def check_position():
    try:
        data = request.json
        frame = data.get("frame")
        modi_frame = np.array(frame, dtype=np.uint8)
        is_okay = check_position_frame(frame=modi_frame)
        print(f"Position: {str(is_okay)}")
        return {'is_in_position': str(is_okay)}, 200
    except Exception as e:
        print(f"error is {str(e)}")
        return jsonify({'error': str(e), 'is_in_position': "False"}), 500









@app.route('/', methods=['GET'])
def test_route():
    return "The routes are working!", 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
