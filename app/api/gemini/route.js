import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { concept, region } = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.URI);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Explain the concept "${concept}" for a high school student and answer in 4-5 lines  using examples from ${region}.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return new Response(JSON.stringify({ response: text }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Gemini error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
