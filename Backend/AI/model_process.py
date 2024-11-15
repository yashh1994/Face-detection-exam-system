
import cv2
import time
from collections import Counter


#! Face detection Model
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

student_logs = {}
# ! Routes 

#! Student class
class StudentLog:
    def __init__(self):
        self.detection_result = []
        self.eye_ratio_result = []
        self.multi_face_times = []
        self.no_face_start = None
        self.no_face_total_time = 0
        self.max_faces_detected = 0
        self.session_start = time.time()

    def log_activity(self, face_detected, eyes_open, face_count):
        self.detection_result.append(face_detected)
        self.eye_ratio_result.append(eyes_open)

        # Update max faces detected if this frame has more
        if face_count > self.max_faces_detected:
            self.max_faces_detected = face_count

    def to_json(self):
        ct = Counter(self.detection_result)
        eye_ct = Counter(self.eye_ratio_result)
        session_duration = time.time() - self.session_start
        face_detect_ratio = (ct[True] / len(self.detection_result)) * 100 if self.detection_result else 0
        no_face_detect_ratio = (ct[False] / len(self.detection_result)) * 100 if self.detection_result else 0
        eyes_open_ratio = (eye_ct[True] / len(self.eye_ratio_result)) * 100 if self.eye_ratio_result else 0
        eyes_closed_ratio = (eye_ct[False] / len(self.eye_ratio_result)) * 100 if self.eye_ratio_result else 0
        multi_face_duration = len(self.multi_face_times) * (1 / 30)  # Assuming 30 FPS

        return {
            "Session Duration": f"{session_duration:.2f} seconds",
            "Face Detected Ratio": f"{face_detect_ratio:.2f}%",
            "No Face Detected Ratio": f"{no_face_detect_ratio:.2f}%",
            "Eyes Open Ratio": f"{eyes_open_ratio:.2f}%",
            "Eyes Closed Ratio": f"{eyes_closed_ratio:.2f}%",
            "Total No Face Detected Time": f"{self.no_face_total_time:.2f} seconds",
            "Multi-Face Detection Time": f"{multi_face_duration:.2f} seconds",
            "Max Faces Detected in Single Frame": f"{self.max_faces_detected}",
        }
    
# Load Haar Cascade models for face and eye detection

# Initialize video capture
# cap = cv2.VideoCapture(0)

# Variables for tracking
# detection_result = []  # Log for each frame if a face is detected
# eye_ratio_result = []  # Log for each frame if eyes are open or closed
# multi_face_times = []  # Log for frames when multiple faces are detected
# no_face_start = None  # Track no-face start time
# no_face_total_time = 0  # Total time with no face detected
# max_faces_detected = 0  # Maximum faces detected in a single frame

# Start time of the session
# session_start = time.time()

# Logging function
# def log_activity(face_detected, eyes_open, face_count):
#     detection_result.append(face_detected)
#     eye_ratio_result.append(eyes_open)

#     # Update max faces detected if this frame has more
#     global max_faces_detected
#     if face_count > max_faces_detected:
#         max_faces_detected = face_count

# ret, frame = cap.read()
# print(frame)




def check_position_frame(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    face_count = len(faces)
    return face_count > 0


def end_process(studentId):
    if studentId in student_logs:
        return student_logs[studentId].to_json()

    else:
        print(f" student id for access {studentId} data is {student_logs}")
        return {"message": f"Student log not found tried to acces {studentId}"}
    



def process_frame(frame,studentId):
    if studentId not in student_logs:
        student_logs[studentId] = StudentLog()
    
    log = student_logs[studentId]


    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    face_count = len(faces)
    face_detected = face_count > 0

    # Track no-face periods
    if face_detected:
        if log.no_face_start:
            log.no_face_total_time += time.time() - log.no_face_start
            log.no_face_start = None
    else:
        if log.no_face_start is None:
            log.no_face_start = time.time()

    # Track multiple face detection times
    if face_count > 1:
        log.multi_face_times.append(time.time() - log.session_start)

    eyes_open = False
    # Process detected faces
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
        
        # Define ROI for eyes within the face region
        face_roi_gray = gray[y:y + h, x:x + w]
        face_roi_color = frame[y:y + h, x:x + w]
        
        # Detect eyes within the face ROI
        eyes = eye_cascade.detectMultiScale(face_roi_gray, scaleFactor=1.1, minNeighbors=5, minSize=(10, 10))
        eyes_open = len(eyes) > 0

        # Draw rectangles around detected eyes
        for (ex, ey, ew, eh) in eyes:
            cv2.rectangle(face_roi_color, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)
    
    # Log activity for current frame
    log.log_activity(face_detected, eyes_open, face_count)

    

    # Exit on 'q' key and show analysis summary
    # if cv2.waitKey(1) & 0xFF == ord('q'):
    #     # Update total no-face time if still active
    #     if no_face_start:
    #         no_face_total_time += time.time() - no_face_start

    #     ct = Counter(detection_result)
    #     eye_ct = Counter(eye_ratio_result)
    #     session_duration = time.time() - session_start
    #     face_detect_ratio = (ct[True] / len(detection_result)) * 100
    #     no_face_detect_ratio = (ct[False] / len(detection_result)) * 100
    #     eyes_open_ratio = (eye_ct[True] / len(eye_ratio_result)) * 100
    #     eyes_closed_ratio = (eye_ct[False] / len(eye_ratio_result)) * 100
    #     multi_face_duration = len(multi_face_times) * (1 / cap.get(cv2.CAP_PROP_FPS))

    #     print("\n===== Exam Monitoring Summary =====")
    #     print(f"Session Duration: {session_duration:.2f} seconds")
    #     print(f"Face Detected Ratio: {face_detect_ratio:.2f}%")
    #     print(f"No Face Detected Ratio: {no_face_detect_ratio:.2f}%")
    #     print(f"Eyes Open Ratio: {eyes_open_ratio:.2f}%")
    #     print(f"Eyes Closed Ratio: {eyes_closed_ratio:.2f}%")
    #     print(f"Total No Face Detected Time: {no_face_total_time:.2f} seconds")
    #     print(f"Multi-Face Detection Time: {multi_face_duration:.2f} seconds")
    #     print(f"Max Faces Detected in Single Frame: {max_faces_detected}")


