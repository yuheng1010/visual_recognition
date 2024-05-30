import React, { useEffect, useState } from 'react';

function CamWin() {
    const [videoSrc, setVideoSrc] = useState('');

    useEffect(() => {
        const fetchVideoFeed = async () => {
            try {
                const response = await fetch('http://localhost:5000/video_feed');
                const reader = response.body.getReader();
                const stream = new ReadableStream({
                    start(controller) {
                        function push() {
                            reader.read().then(({ done, value }) => {
                                if (done) {
                                    controller.close();
                                    return;
                                }
                                controller.enqueue(value);
                                push();
                            });
                        }
                        push();
                    }
                });

                const blob = new Blob([stream], { type: 'video/webm' });
                setVideoSrc(URL.createObjectURL(blob));
            } catch (error) {
                console.error('Error fetching video feed:', error);
            }
        };

        fetchVideoFeed();

        return () => {
            setVideoSrc('');
        };
    }, []);

    return (
        <div>
            {videoSrc && (
                <video src={videoSrc} autoPlay />
            )}
        </div>
    );
}

export default CamWin;
