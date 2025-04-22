from ultralytics import YOLO
import cv2

model = YOLO("yolov8n.pt")  # Load model
cap = cv2.VideoCapture(0)   # 0 for default webcam

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame)  # Run YOLO on current frame
    annotated_frame = results[0].plot()  # Get annotated frame

    cv2.imshow("YOLOv8 Live Detection", annotated_frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()