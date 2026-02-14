import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    // Remove base64 header
    const base64Data = image.split(",")[1];

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/png",
        },
      },
      {
        text: "You are an electronics tutor. Identify components in the image and explain possible wiring mistakes clearly for beginners.",
      },
    ]);

    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ result: text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "AI analysis failed" }),
      { status: 500 }
    );
  }
}
