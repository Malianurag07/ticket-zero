import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // FIX: Using the model explicitly listed in your diagnostic test
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
      generationConfig: { responseMimeType: "application/json" }
    });

    const data = await req.json();

    const prompt = `
      Act as a Senior QA Engineer. 
      Analyze this bug report: "${data.emailText}"
      Output valid JSON with keys: title, severity, summary, steps, fix.
    `;

    // Handle Image or Text-Only
    const promptParts: (string | Part)[] = [prompt];
    
    if (data.imageBase64) {
      // Clean base64 string
      const imageClean = data.imageBase64.replace(/^data:image\/\w+;base64,/, "");
      promptParts.push({
        inlineData: { data: imageClean, mimeType: "image/jpeg" },
      });
    }

    console.log("🚀 Sending request to Gemini 2.5...");
    const result = await model.generateContent(promptParts);
    const response = await result.response;
    const jsonText = response.text();
    console.log("✅ Success!");
    
    return NextResponse.json(JSON.parse(jsonText));

  } catch (error) {
    console.error("🔥 Google API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}