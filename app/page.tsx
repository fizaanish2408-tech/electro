
"use client";

import { useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsCameraOn(true);
    } catch (error) {
      console.error(error);
      alert("Camera access denied or not available.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-6">
        Electro-AI Hardware Assistant ⚡
      </h1>

      {!isCameraOn && (
        <button
          onClick={startCamera}
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200"
        >
          Open Live Camera
        </button>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`mt-6 rounded-xl w-1/2 max-w-2xl border-4 border-white ${
          isCameraOn ? "block" : "hidden"
        }`}
      />
    </main>
  );
}
