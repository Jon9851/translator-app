"use client";
import { useRef, useEffect } from "react";

export default function Camera({ onCapture }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, 
          audio: false,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera Error:", err);
      }
    };
    startCamera();
  }, []);

  const takePicture = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    if (!video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    
    // Create base64 string for the AI
    const base64 = canvas.toDataURL("image/jpeg", 0.7).split(",")[1];
    onCapture(base64);
  };

  return (
    <div className="relative h-screen w-full bg-black flex flex-col items-center justify-center">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="h-full w-full object-cover" 
      />
      
      {/* Capture Button */}
      <div className="absolute bottom-10">
        <button 
          onClick={takePicture}
          className="h-20 w-20 rounded-full border-4 border-white bg-white/20 backdrop-blur-md active:scale-95 transition-all"
        >
          <div className="h-14 w-14 bg-white rounded-full m-auto" />
        </button>
      </div>
    </div>
  );
}