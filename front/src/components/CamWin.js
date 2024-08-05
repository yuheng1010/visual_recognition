import React, { useState, useEffect } from 'react';

function CamWin() {
    const [trans, setTrans] = useState('Processing...');
    
    useEffect(() => {
        const fetchTranslation = async () => {
            try {
                const response = await fetch('http://localhost:5000/getRes');
                const data = await response.json();
                if (data.msg !== 'Processing') {
                    setTrans(data.msg);
                }
            } catch (error) {
                console.error("Error fetching translation", error);
            }
        };

        const interval = setInterval(fetchTranslation, 3000); // Poll every second

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h1>手語辨識</h1>
            <p>結果: {trans}</p>
            <img src="http://localhost:5000/video_feed" alt="Video" />
            
        </div>
    );
}

export default CamWin;