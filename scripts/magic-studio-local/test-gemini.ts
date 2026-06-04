import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testGeminiImage() {
  const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImages?key=${key}`;
  
  const body = {
    instances: [{ prompt: "A photorealistic cat" }],
    parameters: { sampleCount: 1 }
  };

  const res = await fetch(url, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }});
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

testGeminiImage();
