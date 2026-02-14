
"use client";

import { useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);


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
  const captureImage = () => {
  if (videoRef.current && canvasRef.current) {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);

    console.log("Image captured!");
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
      {isCameraOn && (
  <>
    <button
      onClick={captureImage}
      className="mt-4 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600"
    >
      Capture Image
    </button>

    <canvas ref={canvasRef} className="hidden" />

    {capturedImage && (
      <img
        src={capturedImage}
        alt="Captured"
        className="mt-6 rounded-xl w-1/3 border-4 border-green-500"
      />
    )}
  </>
)}

    </main>
  );
}
