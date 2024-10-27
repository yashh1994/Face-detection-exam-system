import cv2
import time
from collections import Counter

# Load Haar Cascade models for face and eye detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

# Initialize video capture
cap = cv2.VideoCapture(0)

# Variables for tracking
detection_result = []  # Log for each frame if a face is detected
eye_ratio_result = []  # Log for each frame if eyes are open or closed
multi_face_times = []  # Log for frames when multiple faces are detected
no_face_start = None  # Track no-face start time
no_face_total_time = 0  # Total time with no face detected
max_faces_detected = 0  # Maximum faces detected in a single frame

# Start time of the session
session_start = time.time()

# Logging function
def log_activity(face_detected, eyes_open, face_count):
    detection_result.append(face_detected)
    eye_ratio_result.append(eyes_open)

    # Update max faces detected if this frame has more
    global max_faces_detected
    if face_count > max_faces_detected:
        max_faces_detected = face_count

ret, frame = cap.read()
print(frame)

# Release the capture and close windows
cap.release()
cv2.destroyAllWindows()





# def process_frame(frame):
#     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

#     # Detect faces
#     faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
#     face_count = len(faces)
#     face_detected = face_count > 0

#     # Track no-face periods
#     if face_detected:
#         if no_face_start:
#             no_face_total_time += time.time() - no_face_start
#             no_face_start = None
#     else:
#         if no_face_start is None:
#             no_face_start = time.time()

#     # Track multiple face detection times
#     if face_count > 1:
#         multi_face_times.append(time.time() - session_start)

#     eyes_open = False
#     # Process detected faces
#     for (x, y, w, h) in faces:
#         cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
        
#         # Define ROI for eyes within the face region
#         face_roi_gray = gray[y:y + h, x:x + w]
#         face_roi_color = frame[y:y + h, x:x + w]
        
#         # Detect eyes within the face ROI
#         eyes = eye_cascade.detectMultiScale(face_roi_gray, scaleFactor=1.1, minNeighbors=5, minSize=(10, 10))
#         eyes_open = len(eyes) > 0

#         # Draw rectangles around detected eyes
#         for (ex, ey, ew, eh) in eyes:
#             cv2.rectangle(face_roi_color, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)
    
#     # Log activity for current frame
#     log_activity(face_detected, eyes_open, face_count)

#     # Display the resulting frame
#     cv2.imshow('Exam Face Monitoring', frame)

#     # Exit on 'q' key and show analysis summary
#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         # Update total no-face time if still active
#         if no_face_start:
#             no_face_total_time += time.time() - no_face_start

#         ct = Counter(detection_result)
#         eye_ct = Counter(eye_ratio_result)
#         session_duration = time.time() - session_start
#         face_detect_ratio = (ct[True] / len(detection_result)) * 100
#         no_face_detect_ratio = (ct[False] / len(detection_result)) * 100
#         eyes_open_ratio = (eye_ct[True] / len(eye_ratio_result)) * 100
#         eyes_closed_ratio = (eye_ct[False] / len(eye_ratio_result)) * 100
#         multi_face_duration = len(multi_face_times) * (1 / cap.get(cv2.CAP_PROP_FPS))

#         print("\n===== Exam Monitoring Summary =====")
#         print(f"Session Duration: {session_duration:.2f} seconds")
#         print(f"Face Detected Ratio: {face_detect_ratio:.2f}%")
#         print(f"No Face Detected Ratio: {no_face_detect_ratio:.2f}%")
#         print(f"Eyes Open Ratio: {eyes_open_ratio:.2f}%")
#         print(f"Eyes Closed Ratio: {eyes_closed_ratio:.2f}%")
#         print(f"Total No Face Detected Time: {no_face_total_time:.2f} seconds")
#         print(f"Multi-Face Detection Time: {multi_face_duration:.2f} seconds")
#         print(f"Max Faces Detected in Single Frame: {max_faces_detected}")
