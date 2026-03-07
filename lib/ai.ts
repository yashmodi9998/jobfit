"use server";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
// Define a Zod schema for the expected structure of the analysis report

const ReportSchema = z.object({
  matchPercentage: z.number().describe("A percentage score indicating how well the resume matches the job description, from 0 to 100."),
  technicalQuestions: z.array(z.object({
    question: z.string().describe("A technical question that the candidate should be prepared to answer based on the job description."),
    answer: z.string().describe("The expected answer to the technical question."),
    intention: z.string().describe("The intent behind the technical question.")
  })).describe("A list of technical questions derived from the job description, along with their expected answers and the intention behind each question."),
  skillScore: z.array(z.object({
    skillGap: z.string().describe("A skill gap identified in the candidate's profile."),
    skillGapSeverity: z.enum(["low", "medium", "high"]).describe("The severity level of the skill gap.")    
  })).describe("A list of skill gaps identified in the candidate's profile, along with their severity levels."),

 // 
  revisedResume: z.object({
    fullName: z.string().describe("The candidate's full name extracted from the resume."),
    jobTitle: z.string().describe("The candidate's current or target job title."),
    revisedSummary: z.string().describe("A concise summary of the candidate's profile, rewritten by the AI to better align with the job description."),
    revisedExperience: z.array(z.object({
      role: z.string().describe("The job role or title from the candidate's experience section."),
      optimizedBulletPoints: z.array(z.string().describe("A list of AI-optimized bullet points for the given role, designed to better align with the job description."))
    })).describe("A list of revised experience entries with optimized bullet points."),
    suggestedSkills: z.array(z.string().describe("A list of additional skills suggested by the AI that the candidate should consider adding to their resume to improve alignment with the job description.")),
    education: z.array(z.object({
      degree: z.string().describe("The degree obtained by the candidate."),
      school: z.string().describe("The institution where the candidate obtained the degree."),
      year: z.string().describe("The year when the candidate obtained the degree.")
    })).describe("Extract education details from the original resume")
  })
});
   

// This function takes a resume and a job description, and returns an analysis report based on the defined schema
export async function generateReport({ resume, jobDescription }: { resume: string; jobDescription: string }) {
  try {
    // We convert the Zod schema to a plain object to satisfy the SDK's strict types
    const jsonSchema = ReportSchema.toJSONSchema() as Record<string, unknown>;
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-lite",
  contents: `
You are a professional resume optimization expert.

Your task is to analyze the provided Resume and Job Description and produce structured data that improves the resume while staying truthful to the candidate’s experience.

Follow these rules carefully:

1. FULL NAME
Extract the candidate's full name exactly as written in the resume.

2. JOB TITLE
Extract the candidate’s current or target job title.

3. SUMMARY
Rewrite the professional summary so it:
- Aligns strongly with the Job Description
- Highlights the candidate’s strongest relevant skills
- Is concise and impactful (3–4 sentences)
- Uses terminology from the Job Description where appropriate 
- Use company names only if they add significant value to the resume. Focus on roles and achievements instead.

4. EXPERIENCE
Rewrite the experience bullet points for each role.

Rules:
- include company names and ROLE
- Use strong action verbs
- Integrate important keywords from the Job Description
- Each role should have 3 bullet points that are  impactful and following star pattern . 
- Focus on achievements and quantifiable results rather than just listing responsibilities.
- Do NOT invent experience that does not exist in the resume

5. EDUCATION
Extract education entries EXACTLY as written in the resume:
- Degree
- School
- Year

Do not modify or rewrite them.

6. CORE COMPETENCIES
Generate a list of relevant technical and professional skills based on:
- the resume
- the job description

Return concise skill keywords only.

Resume:
${resume}

Job Description:
${jobDescription}
`,
  config: {
    responseMimeType: "application/json",
    responseJsonSchema: jsonSchema,
  },
});
// The SDK will validate the response against the provided JSON schema and throw an error if it doesn't match, ensuring we get structured data that we can work with.
    const result = JSON.parse(response.text!);
    console.log("Gemini Output:", JSON.stringify(result, null, 2))
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

