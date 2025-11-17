import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI('AIzaSyByxbDgIHdcbQlnbLz498ZQoIRfEckZyok');

export async function generateText(prompt) {
  const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash",
    apiVersion: "v1"
  });

  const result = await model.generateContent({contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  });

  console.log(result.response.text());
  return result.response.text();
}

generateText();
