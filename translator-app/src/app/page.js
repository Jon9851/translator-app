"use client";
import { useState } from "react";
import Camera from "@/components/Camera"; // Use @ if your alias works, otherwise ../components/Camera

export default function Home() {
  const [translations, setTranslations] = useState([]); 
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
      
      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setTranslations(data);
      } else {
        setTranslations([]); // Clear if nothing found
      }
    } catch (error) {
      console.error("Translation Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* 1. The Camera Component */}
      <Camera onCapture={handleCapture} />

      {/* 2. THE AR LAYER - This maps translations to the screen */}
      <div className="absolute inset-0 pointer-events-none z-40">
        {translations.map((item, index) => (
          <div
            key={index}
            className="absolute bg-yellow-400 text-black px-2 py-1 rounded-md text-sm font-bold shadow-xl whitespace-nowrap"
            style={{ 
              left: `${item.x}%`, 
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)' // Centers the box on the coordinate
            }}
          >
            {item.translation}
          </div>
        ))}
      </div>

      {/* 3. The AI Status UI */}
      {loading && (
        <div className="absolute top-10 left-0 w-full flex justify-center z-50">
          <div className="bg-blue-600 px-6 py-2 rounded-full animate-bounce shadow-lg">
            AI is scanning...
          </div>
        </div>
      )}

      {/* 4. Reset Button (Optional but helpful) */}
      {translations.length > 0 && !loading && (
        <button 
          onClick={() => setTranslations([])}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full z-50"
        >
          Clear Scan
        </button>
      )}
    </main>
  );
}