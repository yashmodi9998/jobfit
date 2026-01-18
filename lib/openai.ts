import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

export async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.replace(/\n/g, ' '), // Clean the text for better results
  });
  return response.data[0].embedding;
}