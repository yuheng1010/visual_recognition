import fitz  # PyMuPDF
from flask import Flask, request, send_file,Response
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS
import numpy as np  # 引入 NumPy 模組
from PIL import Image
import io
from Train_Model_hands2 import start
import cv2
import threading

app = Flask(__name__)
CORS(app)
outputFrame = None
lock = threading.Lock()

def process_pdf(input_path, output_path, type, level):
    # print(type)
    # print(level)
    # 打開PDF
    pdf_document = fitz.open(input_path)
    new_pdf = fitz.open()

    # 每一頁
    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)

        # 拿頁面的像素數據
        pix = page.get_pixmap()

        # 像素轉為PIL圖像
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

        # 圖像數據轉為Numpy
        img_array = np.array(img)

        if level == 's':
            factor = 1.15
        elif level == 'm':
            factor = 1.3
        else:
            factor = 1.5

        # 修改rgb值
        if type == 'r':
            img_array[..., 0] = np.minimum(255, img_array[..., 0] * factor)  # R channel
            img_array[..., 2] = np.minimum(255, img_array[..., 2] * factor)  # B channel
        elif type == 'g':
            img_array[..., 1] = np.minimum(255, img_array[..., 1] * factor) # G channel
            img_array[..., 2] = np.minimum(255, img_array[..., 2] * factor) # B channel
        else:
            img_array[..., 0] = np.minimum(255, img_array[..., 0] * factor) # R channel
            img_array[..., 1] = np.minimum(255, img_array[..., 1] * factor) # G channel
        

        # 修改後的轉回PIL
        img = Image.fromarray(img_array)

        # PIL轉回圖像添加到新的pdf
        img_stream = io.BytesIO()
        img.save(img_stream, format='PDF')
        img_pdf = fitz.open("pdf", img_stream.getvalue())
        new_pdf.insert_pdf(img_pdf)

    # 保存修改後的PDF
    new_pdf.save(output_path)
    new_pdf.close()
    pdf_document.close()
    
def open_cam():
   start()


def generate_frames():
    frame = start()
        
    # Convert the frame to bytes
    ret, buffer = cv2.imencode('.jpg', frame)
    frame_bytes = buffer.tobytes()
    
    # Yield the frame bytes
    yield (b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/process_pdf', methods=['POST'])
def process_pdf_route():
    file = request.files['file']
    type = request.form['type']
    level = request.form['level']
    # print(type)
    # print(level)
    filename = secure_filename(file.filename)
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    output_path = os.path.join(app.config['UPLOAD_FOLDER'], 'processed_' + filename)
    file.save(input_path)


    process_pdf(input_path, output_path, type, level)

    return send_file(output_path, mimetype='application/pdf')

@app.route('/mrserver', methods=['GET'])
def mrserver():
   open_cam()
   return {"msg":"success"}
  

if __name__ == '__main__':
    app.config['UPLOAD_FOLDER'] = 'uploads'
    app.run(port=5000)
