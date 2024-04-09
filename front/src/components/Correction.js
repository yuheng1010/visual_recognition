import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { useState, useEffect, useRef } from 'react';
import "./Correction.css"
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";

function Correction() {
    const [selectedFile, setSelectedFile] = useState(null);
    let type = ""
    let level = ""
    const videoRef = useRef();

    if(localStorage.getItem('type')&&localStorage.getItem('level')){
        type = localStorage.getItem('type')
        level = localStorage.getItem('level')
    }
    function uploaddoc(){
        document.querySelector('#docD').showModal();
    }
    function openCam() {
        document.querySelector('#camD').showModal();
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        })
        .catch(err => {
            console.log("Something went wrong!");
        });
      }
    function closeD() {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        document.getElementById('docD').close();
        document.getElementById('camD').close();

    }
    const fileChangedHandler = event => {
        // setSelectedFile(URL.createObjectURL(event.target.files[0]));
        // document.getElementsByClassName('reColSec')[0].style.display = "block";
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        
        formData.append('type', type);
        formData.append('level', level);

        fetch('http://localhost:5000/process_pdf', {
            method: 'POST',
            body: formData
        })
        .then(response => response.blob())
        .then(blob => {
            setSelectedFile(URL.createObjectURL(blob));
            document.getElementsByClassName('reColSec')[0].style.display = "block";
        });
    };
  return (
    <div>
    <Container className='con3'>
        <Col className='corSec'>
            <text className='corTitle'>書面校正模式</text>
            <br/>
            <text className='corDes'>畫面顯示色弱濾鏡遮罩，將螢幕當前畫面依據您個人色覺障礙狀況做色彩矯正。</text>
            <button className='openDocBtn' onClick={uploaddoc}>開啟書面校正模式</button>
            <button className='openCamBtn' onClick={openCam}>開啟相機濾鏡模式</button>
            <br/>
            <text className='corTitle'>相機濾鏡模式</text>
            <br/>
            <text className='corDes'>連動本裝置攝影機，將鏡頭拍攝到的畫面依據您個人色覺障礙狀況做色彩矯正。</text>
            <br/>
            <Link to="/colorblindness"><button className='reSelBtn'>重新選擇類型/程度</button></Link>
        </Col>
    </Container>
        <dialog className='docD' id="docD" >
        <button className="close" id="close" onClick={closeD}>X</button>
        <input type="file" onChange={fileChangedHandler}/>
        <div className='reColSec'>
            {selectedFile && <object data={selectedFile} type="application/pdf" width="100%" height="100%"></object>}
        </div>
        </dialog>

        <dialog className='camD' id="camD" >
        <button className="close" id="close" onClick={closeD}>X</button>
        <video ref={videoRef} />
        </dialog>
    </div>
  );
}
export default Correction;

