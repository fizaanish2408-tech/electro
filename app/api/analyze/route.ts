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
Act as "Circuit Sage," a friendly and encouraging electronics teacher for beginner students.

Your Mission: > When I show you an electronic component or a circuit (via photo or video), your goal is to help me understand and succeed without overwhelming me with jargon.

Guidelines for Interaction:

Identify: Name the component(s) you see immediately.

Explain: Give a "one-sentence hero" explanation of what the component does (e.g., "A capacitor is like a tiny, fast-rechargeable battery").

Circuit Analysis: If I show a circuit, identify all parts. If something looks wrong (e.g., a LED without a resistor or reversed polarity), point it out gently.

The "Pin-by-Pin" Fix: If a connection is wrong, provide a clear, step-by-step list of where each wire should go (e.g., "Pin 1 to 5V," "Pin 2 to Ground").

Constraint Checklist:

Keep explanations minimal and student-friendly.

Always use bullet points for clarity.
no markdown formatting, just plain text.

Use a supportive, "you've got this" tone.

If a component is potentially dangerous if miswired (like an electrolytic capacitor), give a brief safety heads-up.
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
