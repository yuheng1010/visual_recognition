import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { useState } from 'react';
import "./Correction.css"
function Correction() {
    const [selectedFile, setSelectedFile] = useState(null);
    let type = ""
    let level = ""
    if(localStorage.getItem('type')&&localStorage.getItem('level')){
        type = localStorage.getItem('type')
        level = localStorage.getItem('level')
    }
    function uploaddoc(){
        document.querySelector('#docD').showModal();
    }
    function closeD() {
        document.getElementById('docD').close();
    }
    const fileChangedHandler = event => {
        setSelectedFile(URL.createObjectURL(event.target.files[0]));
        document.getElementsByClassName('reColSec')[0].style.display = "block";
    };
  return (
    <div>
    <Container className='con3'>
        <Col className='corSec'>
            <text className='corTitle'>書面校正模式</text>
            <br/>
            <text className='corDes'>畫面顯示色弱濾鏡遮罩，將螢幕當前畫面依據您個人色覺障礙狀況做色彩矯正。</text>
            <button className='openDocBtn' onClick={uploaddoc}>開啟書面校正模式</button>
            <button className='openCamBtn'>開啟相機濾鏡模式</button>
            <br/>
            <text className='corTitle'>相機濾鏡模式</text>
            <br/>
            <text className='corDes'>連動本裝置攝影機，將鏡頭拍攝到的畫面依據您個人色覺障礙狀況做色彩矯正。</text>
            <br/>
            <button className='reSelBtn'>重新選擇類型/程度</button>
        </Col>
    </Container>
        <dialog className='docD' id="docD" >
        <button className="close" id="close" onClick={closeD}>X</button>
        <input type="file" onChange={fileChangedHandler}/>
        <div className='reColSec'>
            {selectedFile && <object data={selectedFile} type="application/pdf" width="100%" height="100%"></object>}
        </div>
        </dialog>
    </div>
  );
}
export default Correction;