import mongoose from "mongoose";
// Report model to store the analysis results for each user and job application

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

}, { timestamps: true });
const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);

export default Report;