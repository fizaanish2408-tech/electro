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
  text: `
You are an electronics tutor for beginners.

Analyze the image and respond ONLY in this table format:

Component | Purpose | Problem (if any) | Fix
--- | --- | --- | ---
Example | What it does | What is wrong | How to fix

Rules:
- Keep sentences very short.
- Use simple words.
- Do NOT use markdown symbols like **.
- Do NOT write paragraphs.
- Only output the table.
`,
}

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
