import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { circuitName } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
    You are an electronics tutor.

    Explain the "${circuitName}" in simple structured format:

    Component:
    Purpose:
    How to Connect:
    Common Mistake:
    Safety Tip:

    Keep explanation vey very short and beginner-friendly and use simple language.
    rememeber it mainly focuses on beginners, no need to dive into complex details.
    No markdown.
    Plain text only.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ result: text }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Circuit analysis failed" }),
      { status: 500 }
    );
  }
}
