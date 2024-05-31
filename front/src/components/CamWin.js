import React, { useState, useEffect, useRef } from 'react';
function CamWin(){
    const [trans, setTrans] = useState(null);
    const [status, setStatus] = useState(null)
    const videoRef = useRef();
    var res 
    // while(!res){
        // setInterval(async()=>{
        //     fetch('http://localhost:5000/getRes', {
        //     method: 'GET',
        // })
        // .then(response => response.json())
        // .then(data => {
        //     setTrans(data)
        // });
        // },5000)
        
    // }

    

    function openCam() {
        // fetch("http://localhost:5000/mrserver")
        setStatus("Detecting...")
        fetch('http://localhost:5000/mrserver', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            setTrans("辨識結果:"+data.result)
            console.log(data)
        });
        // navigator.mediaDevices.getUserMedia({ video: true })
        // .then(stream => {
        //     let video = videoRef.current;
        //     video.srcObject = stream;
        //     video.play();
        // })
        // .catch(err => {
        //     console.log("Something went wrong!");
        // });
      }
    return(
        <div>
        <text>{status}</text>
        <br></br>
        <text>{trans}</text>
        <br></br>
        {/* <video ref={videoRef} /> */}
        <button className='openCamBtn' onClick={openCam}>開始手語辨識</button>
        </div>
    )
}
export default CamWin