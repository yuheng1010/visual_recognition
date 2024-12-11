



import requests
import os
import numpy as np
import time
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical
from PIL import ImageFont, ImageDraw, Image


# 2. 模組需要的字詞 Labels
def start():
    actions = np.array(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'check', 'finish', 'give_you',
                    'good', 'i', 'id_card', 'is', 'money', 'saving_book', 'sign', 'taiwan', 'take', 'ten_thousand', 'yes'])


    label_map = {label:num for num, label in enumerate(actions)}
    print(label_map)
    print(actions.shape[0])


    def get_dataset(data_path_trans):
        input_texts = []
        target_texts = []

        input_characters = set()
        target_characters = set()
        with open(data_path_trans, 'r', encoding='utf-8') as f:
            lines = f.read().split('\n')
        for line in lines:
            input_text, target_text= line.split('   ')
            # 用tab作用序列的开始，用\n作为序列的结束
            target_text = '\t' + target_text + '\n'

            input_texts.append(input_text)
            target_texts.append(target_text)
            
            for char in input_text:
                if char not in input_characters:
                    input_characters.add(char)
            for char in target_text:
                if char not in target_characters:
                    target_characters.add(char)
        return input_texts,target_texts,input_characters,target_characters

    # data_path_trans = r'C:\Users\heng\Desktop\visual_recognition\Model\EngToChinese_service1_1029.txt'
    data_path_trans = r"./Model/EngToChinese_service1_1029.txt"
    input_texts,target_texts,input_characters,target_characters = get_dataset(data_path_trans)


    input_characters = sorted(list(input_characters))
    target_characters = sorted(list(target_characters))

    num_encoder_tokens = len(input_characters)
    num_decoder_tokens = len(target_characters)

    max_encoder_seq_length = max([len(txt) for txt in input_texts])
    max_decoder_seq_length = max([len(txt) for txt in target_texts])


    input_token_index = dict(
        [(char, i) for i, char in enumerate(input_characters)])
    target_token_index = dict(
        [(char, i) for i, char in enumerate(target_characters)])

    reverse_target_char_index = dict(
        (i, char) for char, i in target_token_index.items())


    from tensorflow.keras.models import load_model


    new_model = load_model('Model/model1_service1_0924.keras')
    new_model_order = load_model("Model/model2_service1_1029.h5")
    new_model.summary()


    import cv2
    import mediapipe as mp
    from collections import Counter

    mp_holistic = mp.solutions.holistic # Holistic model
    mp_drawing = mp.solutions.drawing_utils # Drawing utilities



    colors = [(245,117,16)] * 24
    def prob_viz(res, actions, input_frame, colors):
        output_frame = input_frame.copy()
        for num, prob in enumerate(res):

            cv2.rectangle(output_frame, (0,60+num*17), (int(prob*100), 90+num*17), colors[num], -1)
        return output_frame

    def mediapipe_detection(image, model):
        # Transfer image
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        # Make prediction
        results = model.process(image)
        return results



    def draw_styled_landmarks(image, results):
        # Draw pose connections
        mp_drawing.draw_landmarks(
            image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS,
            mp_drawing.DrawingSpec(color=(80,22,10), thickness=2, circle_radius=4), 
            mp_drawing.DrawingSpec(color=(80,44,121), thickness=2, circle_radius=2)
        )
        # Draw left hand connections
        mp_drawing.draw_landmarks(
            image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS, 
            mp_drawing.DrawingSpec(color=(121,22,76), thickness=2, circle_radius=4), 
            mp_drawing.DrawingSpec(color=(121,44,250), thickness=2, circle_radius=2)
        ) 
        # Draw right hand connections  
        mp_drawing.draw_landmarks(
            image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS, 
            mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=4), 
            mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
        ) 


    def extract_keypoints_without_face(results):
        pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
        lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21*3)
        rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(21*3)
        return np.concatenate([lh, rh]) 

    def translate(model_opt):
        in_encoder = np.zeros((1, max_encoder_seq_length, num_encoder_tokens),dtype='float32')

        for t, char in enumerate(model_opt):
            in_encoder[0, t, input_token_index[char]] = 1.
        in_encoder[0, t + 1:, input_token_index[' ']] = 1.

        in_decoder = np.zeros((len(in_encoder), max_decoder_seq_length, num_decoder_tokens),dtype='float32')
        in_decoder[:, 0, target_token_index["\t"]] = 1

        # 生成 decoder 的 output
        for i in range(max_decoder_seq_length - 1):
            predict = new_model_order.predict([in_encoder, in_decoder])
            predict = predict.argmax(axis=-1)
            predict_ = predict[:, i].ravel().tolist()
            for j, x in enumerate(predict_):
                in_decoder[j, i + 1, x] = 1 # 將每個預測出的 token 設為 decoder 下一個 timestamp 的輸入
        seq_index = 0
        decoded_sentence = ""
        output_seq = predict[seq_index, :].ravel().tolist()
        for x in output_seq:
            if reverse_target_char_index[x] == "\n":
                break
            else:
                decoded_sentence+=reverse_target_char_index[x]

        return decoded_sentence

    sequence = []
    sentence = []
    predictions = []
    threshold = 0.7
    alarm_set = False
    trans_result =""

    cap = cv2.VideoCapture(0)
    # Set mediapipe model 
    with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Make detections
            results = mediapipe_detection(frame, holistic)
            # Draw landmarks
            draw_styled_landmarks(frame, results)
            
            # 2. Prediction logic
            keypoints = extract_keypoints_without_face(results)
            if np.count_nonzero(keypoints) > 30:
                sequence.append(keypoints)
                sequence = sequence[-30:]
            
            if len(sequence) == 30:
                res = new_model.predict(np.expand_dims(sequence, axis=0))[0]
                if res[np.argmax(res)] > threshold: 
                    predictions.append(np.argmax(res))


                
                
            #3. Viz logic
                if Counter(predictions[-10:]).most_common(1)[0][0]==np.argmax(res):      
                    if len(sentence) > 0: 
                        if actions[np.argmax(res)] != sentence[-1]:
                            sentence.append(actions[np.argmax(res)])
                            sequence = []
                            last_updated_time = time.time()
                            alarm_set = True
                    else:
                        sentence.append(actions[np.argmax(res)])
                        sequence = []
                        last_updated_time = time.time()
                        alarm_set = True

                if len(sentence) > 5: 
                    sentence = sentence[-5:]

                # Viz probabilities
                frame = prob_viz(res, actions, frame, colors)
                
            current_time = time.time()  
            if alarm_set and current_time - last_updated_time >= 10:
                # 時間過10秒，將 sentence 放入下一個模型進行預測
                trans_result = translate(' '.join(sentence))
                print('---result---', trans_result)
                # 清空 sentence 資料
                url = 'http://localhost:5000/handlanRes'
                data = {'result': trans_result}  # 將trans_result作為結果放入字典中
                response = requests.post(url, data=data)
                return data
                alarm_set = False
                sequence = []
                sentence = []
                
            img = np.zeros((40,640,3), dtype='uint8')
            fontpath = 'NotoSerifCJKtc-Regular.otf'
            font = ImageFont.truetype(fontpath, 20)
            imgPil = Image.fromarray(img)
            draw = ImageDraw.Draw(imgPil)
            draw.text((0, 0), trans_result, fill=(255, 255, 255), font=font)
            img = np.array(imgPil)
            
            cv2.rectangle(frame, (0,0), (640, 40), (245, 117, 16), -1)
            cv2.putText(frame, ' '.join(sentence), (3,30), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
            if frame.shape[1] != img.shape[1]:
                # Resize img to have the same number of columns as frame
                img = cv2.resize(img, (frame.shape[1], img.shape[0]))

            # Check if they have the same type
            if frame.dtype != img.dtype:
                # Convert img to the same type as frame
                img = img.astype(frame.dtype)
            outputframe = cv2.vconcat([frame, img])
            # cv2.imshow('SignLanguage', outputframe)
            ret, buffer = cv2.imencode('.jpg', outputframe)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


            if cv2.waitKey(10) & 0xFF == ord('x'):
                break
        cap.release()
        cv2.destroyAllWindows()
    

