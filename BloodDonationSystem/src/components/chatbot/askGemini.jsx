import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function askGemini(prompt) {
  // prompt giờ là string đã chuẩn hóa
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response?.text || "Không có phản hồi từ Gemini";
}
