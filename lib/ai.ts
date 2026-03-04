"use server";

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const ReportSchema = z.object({
  matchingPercentage: z.number().describe("A percentage score indicating how well the resume matches the job description, from 0 to 100."),
  technicalQuestions: z.array(z.object({
    question: z.string().describe("A technical question that the candidate should be prepared to answer based on the job description."),
    answer: z.string().describe("The expected answer to the technical question."),
    intention: z.string().describe("The intent behind the technical question.")
  })).describe("A list of technical questions derived from the job description, along with their expected answers and the intention behind each question."),
  skillScore: z.array(z.object({
    skillGap: z.string().describe("A skill gap identified in the candidate's profile."),
    skillGapSeverity: z.enum(["low", "medium", "high"]).describe("The severity level of the skill gap.")    
  })).describe("A list of skill gaps identified in the candidate's profile, along with their severity levels.")
});



export async function generateReport({ resume, jobDescription }: { resume: string; jobDescription: string }) {
  try {
    // We convert the Zod schema to a plain object to satisfy the SDK's strict types
    const jsonSchema = ReportSchema.toJSONSchema() as Record<string, unknown>;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Use the smarter model
      contents: `Perform a deep technical analysis. Resume: ${resume} JD: ${jobDescription}`,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: jsonSchema, 
      },
    });

    const result = JSON.parse(response.text!);
    
    return ReportSchema.parse(result);

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Analysis Failed:", error.message);
    } else {
      console.error("Analysis Failed:", error);
    }
    throw new Error("We couldn't analyze the resume. Please try again.");
  }
}