import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "No API Key found in .env.local" }, { status: 500 });
    }

    console.log("🔑 Testing Key...");

    // Direct fetch to Google API to see what models are allowed
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    
    if (!response.ok) {
       const errorText = await response.text();
       return NextResponse.json({ error: "Google Rejected Key", details: errorText }, { status: response.status });
    }

    const data = await response.json();
    
    // Extract just the names of the models
    // We type 'm' explicitly to avoid the 'any' error
    const modelNames = data.models.map((m: { name: string }) => m.name);

    return NextResponse.json({ 
      success: true, 
      available_models: modelNames 
    });

  } catch (error: unknown) {
    // Fix: Handle 'unknown' error type safely
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}