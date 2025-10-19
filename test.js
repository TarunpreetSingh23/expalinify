import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.URI);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent("Hello world");
  console.log(result.response.text());
}

test().catch(console.error);
