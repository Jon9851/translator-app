import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Initialize the AI with the key from your .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { image } = await req.json();

    // 2. Use the "Flash" model (it's the fastest and cheapest)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // 3. The Instruction
    const prompt = "Analyze this image. Find any text. Translate it to English. Return ONLY a JSON array: [{'translation': 'text'}]";

    // 4. Send the image to Google
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const responseText = result.response.text();
    
    // 5. Clean the response (sometimes AI adds ```json blocks)
    const cleanedJson = responseText.replace(/```json|```/g, "");
    
    return new Response(cleanedJson, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to translate" }), { status: 500 });
  }
}