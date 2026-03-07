import mongoose from "mongoose";
// Report model to store the analysis results for each user and job application
// Sub-schema for the technical questions generated 
const technicalQuestionsSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"],
    },
    answer: {
        type: String,
        required: [true, "Answer is required"],
    },
    intention : {
        type: String,
        required: [true, "Intention is required"],
    }
},{
_id : false
}
);
// Sub-schema for the skill gap analysis results
const skillSchema = new mongoose.Schema({
    skillGap: {
        type: String,
        required: [true, "Skill name is required"],
    },
    skillGapSeverity: {
        type: String,
        required: [true, "Severity is required"],
        enum:["low", "medium", "high"]
    },

    }          
);

// Sub-schema for the AI-rewritten resume content
const revisedResumeSchema = new mongoose.Schema({
    fullName: String,
    jobTitle: String,
    revisedSummary: String,
    revisedExperience: [{
        role: String,
        optimizedBulletPoints: [String]
    }],
    suggestedSkills: [String],
    education: [{
        degree: String,
        school: String,
        year: String
    }]
}, { _id: false }); 

// Main report schema
const ReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
    },
jobDescription: {
    type: String,
    required: [true, "Job description is required"],
  },
  resume: {
    type: String,
    required: [true, "Resume is required"],
  },

  technicalQuestions: [technicalQuestionsSchema],
  skillScore: [skillSchema],
  matchPercentage: {
    type: Number,
    required: [true, "Match percentage is required"],
  },
    //default value is set to an empty object to ensure the field exists even if the AI doesn't return any data for it, preventing potential issues when accessing nested properties later on.
    revisedResume: {
        type: revisedResumeSchema,
        default: () => ({})
    }

}, { timestamps: true });

const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);

export default Report;