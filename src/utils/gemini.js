// import { GoogleGenerativeAI } from "@google/generative-ai";
// let ai=null;
// const geminiConfig=async ()=>{
//   try{
//  ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
//   }catch(err){
//     console.log("error during connect gemini api",err);
//     return null;
//   }
// }
// geminiConfig();
export async function generateText(prompt) {
  return 0;
  // try {
  //   if (!ai) {
  //     console.log("Gemini not initialized");
  //     return null;
  //   }

  //   if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
  //     console.log("Invalid prompt");
  //     return null;
  //   }

  //   const model = ai.getGenerativeModel({
  //     model: "gemini-2.5-flash",
  //   });

  //   const result = await model.generateContent(prompt);

  //   const text = result.response.text();

  //   console.log(text);
  //   return text;

  // } catch (error) {
  //   console.error("Gemini Error:", error);
  //   return null;
  // }
}

