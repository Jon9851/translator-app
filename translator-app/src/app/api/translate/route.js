import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Setup the connection to Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    // 2. Get the image data sent from your phone
    const { image } = await req.json();

    // 3. Choose the model (Flash is fastest)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // 4. THE PROMPT: This tells the AI exactly how to behave.
    // We are asking for JSON so our code can read the X and Y coordinates.
    const prompt = `
      Identify all text in this image. 
      Translate each piece of text into English.
      Return the result ONLY as a JSON array of objects.
      Each object must look like this:
      {"translation": "Hello", "x": 50, "y": 20}
      Note: x and y should be the percentage (0-100) of where the text is located.
    `;

    // 5. Send the image and prompt to the AI
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image,
          mimeType: "image/jpeg",
        },
      },
    ]);

    // 6. Get the text response and clean it
    const responseText = result.response.text();
    const cleanedJson = responseText.replace(/```json|```/g, "").trim();
    
    // 7. Send the coordinates and translations back to your page.js
    return new Response(cleanedJson, {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("AI Error:", error);
    return new Response(JSON.stringify({ error: "AI failed to respond" }), { status: 500 });
  }
}