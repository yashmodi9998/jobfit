"use server";

import pdf from "pdf-parse-fork";

export async function parsePDF(formData: FormData) {
  try {
    // Validate incoming data
    const file = formData.get("resume") as File;
    const jobDescription = formData.get("jobDescription") as string;

    if (!file || !jobDescription) {
      return { success: false, error: "Please provide both a resume and a job description." };
    }

    //  Convert File to Buffer for the library
    const arrayBuffer = await file.arrayBuffer();
    // pdf-parse-fork expects a Node.js Buffer, so we convert the ArrayBuffer to Buffer
    const buffer = Buffer.from(arrayBuffer);

    //  Extract Text
    const pdfData = await pdf(buffer);
    // Basic validation to ensure we got text back
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length === 0) {
      throw new Error("Could not extract any text from the PDF. It might be an image.");
    }
//  Return extracted text and job description for further processing
    return { 
      success: true, 
      data: {
        resumeText,
        jobDescription
      }
    };

  } catch (error ) {
    // Handle errors
    if (error instanceof Error) {
    console.error("Extraction Error:", error.message);
    return { success: false, error: error.message || "Failed to process PDF." };
  }
}
  
}