import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Poem, PoemAnalysis } from '../types';

// Initialize Gemini Client
// Note: In a production env, ensure API_KEY is set. 
// For this demo, we assume process.env.API_KEY is available as per instructions.
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzePoem = async (poem: Poem): Promise<PoemAnalysis> => {
  const client = getClient();
  if (!client) throw new Error("API Key missing");

  const prompt = `Analyze the following poem titled "${poem.title}" by ${poem.author}.
  Poem text:
  ${poem.lines.join('\n')}
  
  Provide a JSON response with:
  - mood: A few words describing the mood.
  - summary: A 2-sentence summary.
  - themes: An array of 3-4 key themes.
  `;

  try {
    const response: GenerateContentResponse = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.STRING },
            summary: { type: Type.STRING },
            themes: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No analysis generated");
    
    return JSON.parse(text) as PoemAnalysis;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};

export const generatePoemImage = async (poem: Poem): Promise<string> => {
  const client = getClient();
  if (!client) throw new Error("API Key missing");

  // Create a visual prompt based on the poem
  const prompt = `A dreamy, artistic, abstract visual representation of this poem: "${poem.title}" by ${poem.author}.
  The mood is ${poem.lines.slice(0, 5).join(' ')}.
  Style: Soft, ethereal, high quality, digital art.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
    });

    // Iterate through parts to find the image
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};
