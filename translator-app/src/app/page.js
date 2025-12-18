"use client";
import { useState } from "react";
import Camera from "./components/Camera";

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCapture = async (base64Image) => {
    setLoading(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();
      setResult(data); 
    } catch (error) {
      console.error("Translation Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* 1. The Camera Component */}
      <Camera onCapture={handleCapture} />

      {/* 2. The AI Status UI */}
      {loading && (
        <div className="absolute top-20 left-0 w-full text-center bg-blue-600 py-2 animate-pulse z-50">
          AI is thinking...
        </div>
      )}

      {/* 3. The Result Display */}
      {result && (
        <div className="absolute bottom-32 left-0 w-full p-4 z-50">
          <div className="bg-white text-black p-4 rounded-2xl shadow-2xl">
            <p className="text-xs uppercase text-gray-500 font-bold mb-1">Translation</p>
            <p className="text-lg">{result[0]?.translation || "No text found"}</p>
          </div>
        </div>
      )}
    </main>
  );
}