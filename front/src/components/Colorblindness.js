import "./Colorblindness.css"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import eye from "../img/eye.png"
import React, { useEffect, useState } from 'react'
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";

function Colorblindness(){
    const [type, setType] = useState([])
    const [level, setLevel] = useState([])

    function changeType(e){
        document.getElementById(e).style.backgroundColor="#D9D9D9"
        for(var i=0;i<3;i++){
            if(e!==document.getElementsByClassName("type")[i].id){
                document.getElementsByClassName("type")[i].style.backgroundColor="white"
            }
        }
        setType(e)
        localStorage.setItem('type',e)
    }
    function changeLevel(e){
        document.getElementById(e).style.backgroundColor="#D9D9D9"
        for(var i=0;i<3;i++){
            if(e!==document.getElementsByClassName("level")[i].id){
                document.getElementsByClassName("level")[i].style.backgroundColor="white"
            }
        }
        setLevel(e)
        localStorage.setItem('level',e)
        document.getElementById("nextbtn").style.backgroundColor="#3D8F30"
        document.getElementById("nextbtn").style.color="#ffffff"
    }
    return(
        <div>
        <Container className="con2">
            <Col>
                <Row className="description">
                    <img className="eyeC" src={eye}/>
                    <Col>
                        <div className="eyeTextC">為提供更完善的操作體驗，請勾選您個人的色覺障礙類型及程度分級。</div>
                        <div className="eyeTextC2">不知道自己屬於哪一類型？<text className="testUrl">點此進入簡易測驗</text></div>
                        
                    </Col>
                </Row>
                <Row className="selection">
                    <div className="selectType">
                        <text className="selectTypeText">色覺障礙類型：</text>
                        <button className="type" id="r" onClick={()=>changeType("r")}>紅色弱</button>
                        <button className="type" id="g" onClick={()=>changeType("g")}>綠色弱</button>
                        <button className="type" id="by" onClick={()=>changeType("by")}>藍黃色弱</button>
                    </div>
                    <div className="selectLevel">
                        <text className="selectLevelText">程度：</text>
                        <button className="level" id="s" onClick={()=>changeLevel("s")}>輕度</button>
                        <button className="level" id="m" onClick={()=>changeLevel("m")}>中度</button>
                        <button className="level" id="l" onClick={()=>changeLevel("l")}>重度</button>
                    </div>
                </Row>
                <Link to="/correction"><button className="nextbtn" id="nextbtn" >下一步</button></Link>
            </Col>

        </Container>
        
    </div>
    )
}
export default Colorblindness;