import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { concept, region } = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.URI);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // UPDATED PROMPT: Requesting a concise, accurate answer limited to 4-5 sentences.
    const prompt = `Provide a concise and accurate explanation of the following topic for a high school student. Limit the answer to 4-5 sentences and use an example related to ${region}: "${concept}"`;

    const result = await model.generateContent(prompt);
    // Best practice to use .text property instead of .text() method
    const text = result.response.text;

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
