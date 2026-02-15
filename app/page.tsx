
"use client";

import { useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string>("");



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

const captureImage = async () => {
  if (videoRef.current && canvasRef.current) {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);

    setAiResponse("Analyzing image...");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error("API failed");
      }

      const data = await response.json();
      setAiResponse(data.result);

      // Speak AI response
      const speech = new SpeechSynthesisUtterance(data.result);
      speech.rate = 1;      // Speed (1 = normal)
      speech.pitch = 1;     // Voice pitch
      speech.lang = "en-US"; // Language

      window.speechSynthesis.cancel(); // Stop previous speech
      window.speechSynthesis.speak(speech);


    } catch (error) {
      console.error(error);
      setAiResponse("AI analysis failed.");
    }
  }
};

 
const handleCircuitClick = async (circuitName: string) => {
  setAiResponse("Analyzing circuit...");

  try {
    const response = await fetch("/api/ledcircuit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ circuitName: "LED Basic Circuit"}),
    });

    const data = await response.json();
    setAiResponse(data.result);
     // Speak AI response
    const speech = new SpeechSynthesisUtterance(data.result);
    speech.rate = 1;      // Speed (1 = normal)
    speech.pitch = 1;     // Voice pitch
    speech.lang = "en-US"; // Language

    window.speechSynthesis.cancel(); // Stop previous speech
    window.speechSynthesis.speak(speech);
  

  } catch (error) {
    console.error(error);
    setAiResponse("Circuit analysis failed.");
  }
};





  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-6">
        ELECTRO-AI Hardware Assistant ⚡
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

    <button
      onClick={() => handleCircuitClick("LED Basic Circuit")}
      className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700"
>
      LED Basic Circuit
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

{aiResponse && (
  <div className="mt-6 bg-gray-900 p-4 rounded-xl border border-green-500 w-1/2 text-center">
    <p className="text-green-400 font-semibold">AI Response:</p>
    <p className="mt-2 text-white">{aiResponse}</p>
  </div>
)}


    </main>
  );
}
