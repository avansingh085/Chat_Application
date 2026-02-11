import { GoogleGenerativeAI } from "@google/generative-ai";
let ai=null;
const geminiConfig=async ()=>{
  try{
 ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  }catch(err){
    console.log("error during connect gemini api",err);
    return null;
  }
}
geminiConfig();
export async function generateText(prompt) {
  if(!ai)
  {
    console.log("failed to connect gemini");
    return;
  }
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
