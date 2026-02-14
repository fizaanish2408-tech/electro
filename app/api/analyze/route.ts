import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {

    const { image } = await req.json();
    

    const base64Data = image.split(",")[1];

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/png",
        },
      },
      {
        text: "Explain what you see in this image.",
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
