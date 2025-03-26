import { useEffect, useState } from "react";
import useAuthContext from "../../contexts/AuthContext";

export default function AKezdolap() {
    const { user } = useAuthContext();
    const videos = [
        "rallyvid1.mp4",
        "rallyvid2.mp4",
        "rallyvid3.mp4",
        "rallyvid4.mp4",
        "rallyvid5.mp4"
    ];

    const [randomVideo, setRandomVideo] = useState("");
    const [videoWidth, setVideoWidth] = useState(600); 

    useEffect(() => {
        pickNewVideo();
    }, []);

    const pickNewVideo = (prevVideo = "") => {
        let availableVideos = videos.filter(video => video !== prevVideo);
        const randomIndex = Math.floor(Math.random() * availableVideos.length);
        setRandomVideo(`/videos/${availableVideos[randomIndex]}`);
    };

    return (
        <div className="container mt-5 text-center">
            <h1>Üdvözöljük kedves: {user ? user.name : "Nincs bejelentkezett felhasználó!"}</h1>
            <p>Jó munkát</p>

            {randomVideo && (
                <>
                    <video
                        key={randomVideo}
                        width={videoWidth}
                        controls
                        autoPlay
                        muted
                        loop={false}
                        playsInline
                        onEnded={() => pickNewVideo(randomVideo)}
                        style={{ maxWidth: "100%" }}
                    >
                        <source src={randomVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Video Size Slider */}
                    <div className="mt-3 d-flex align-items-center justify-content-center">
                        <label htmlFor="videoSize" className="me-2">Video Size: {videoWidth}px</label>
                        <input
                            id="videoSize"
                            type="range"
                            min="200"
                            max="800"
                            step="50"
                            value={videoWidth}
                            onChange={(e) => setVideoWidth(Number(e.target.value))}
                            className="form-range"
                            style={{ width: "200px" }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
