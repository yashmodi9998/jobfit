"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

export async function calculateMatch(resumeText: string, jdText: string) {
  try {
    const prompt = `
  You are an expert Executive Recruiter with 20 years of experience across multiple industries. 
  Your task is to conduct a high-fidelity comparison between the provided Resume and Job Description (JD).

  Evaluation Framework:
  1. Transferable Skills: If a candidate uses a tool or framework equivalent to the one in the JD (e.g., GCP vs AWS, React vs Vue, or Salesforce vs HubSpot), treat it as a strong match.
  2. Experience Level: Compare the years of experience and seniority (Junior, Senior, Lead) requested versus what is provided.
  3. Industry Context: Evaluate if the candidate has worked in similar environments (e.g., Startups, Enterprise, Healthcare, etc.).
  4. Accuracy: Do not hallucinate skills. If it isn't on the resume, it's a gap.

  Output Instructions:
  - You MUST return a JSON object.
  - The "score" should reflect the overall alignment (0-100).
  - The "verdict" should be a professional, one-sentence executive summary.
  - The "strengths" should highlight the top 3 competitive advantages of the candidate.
  - The "gaps" should identify the top 3 missing requirements or areas for growth.

  Structure:
  {
    "score": number,
    "verdict": "string",
    "strengths": ["string", "string", "string"],
    "gaps": ["string", "string", "string"]
  }

  Resume Content: ${resumeText}
  Job Description: ${jdText}
`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-effective and fast
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || "{}");

  } catch (error) {
    console.error("AI Analysis Error:", error);
    return { error: "Failed to evaluate match." };
  }
}