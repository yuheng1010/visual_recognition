import "./Homepage.css"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import head from "../img/head.png"
import eye from "../img/eye.png"
import ear from "../img/ear.png"
import React, { useEffect, useState } from 'react'
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";


function Homepage(){
    function getAPI(){
        // fetch("http://localhost:5000/mrserver")
    }

    return(
        <Container className="con1">
            <Col>
                <div className="homeTitle1">How can I help you ?</div>
                <div className="homeTitle2">歡迎體驗無障礙櫃台，我們能提供什麼幫助？</div>
                <Row className="head">
                    <img className="head1" src={head}/>
                    <Link to="/colorblindness">
                        <img className="eye" src={eye}/>
                        <div className="eyeText">Colorblindness</div>
                    </Link>
                    <Link to="/handlan">
                  
                        <img onClick={getAPI} className="ear" src={ear}/>
                        <div className="earText">Sign Language</div>
                   
                    </Link>
                    
                </Row>
            </Col>
        </Container>
            
    )
}

export default Homepage;