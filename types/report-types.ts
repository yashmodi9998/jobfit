export interface RevisedResume {
  fullName?: string; // Made optional
  jobTitle?: string; // Made optional
  revisedSummary: string;
  revisedExperience: {
    role: string;
    optimizedBulletPoints: string[];
  }[];
  suggestedSkills: string[];
  education: {
    degree: string;
    school: string;
    year: string;
  }[];
}

export interface ReportData {
  _id: string;
  userId: string;
  matchPercentage: number;
  resume: string;
  jobDescription: string;
  revisedResume: RevisedResume;
  skillScore: {
    skillGap: string;
    skillGapSeverity: "low" | "medium" | "high";
  }[];
  technicalQuestions: {
    question: string;
    answer: string;
    intention: string;
  }[];
  createdAt: string;
  updatedAt: string;
}