# 🚀 FitJob: AI-Powered Career Intelligence

**FitJob** is a high-performance career optimization platform built with the 2026 tech stack. It leverages Generative AI to bridge the gap between job seekers and their dream roles through deep topological analysis of skill sets and automated interview preparation.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **AI Engine:** [Google Gemini 3 Flash](https://ai.google.dev/) (Structured Output & JSON Schema)
- **Security:** [Auth.js v5](https://authjs.dev/) (Edge-compatible Middleware, JWT Strategy)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/) (Mongoose ODM)
- **Validation:** [Zod](https://zod.dev/) (End-to-end type safety)

---

## ✨ Key Features

### 🔍 AI Resume Gap Analysis
Users upload a PDF resume against a specific Job Description. The system utilizes Gemini 3 Flash with strict JSON schemas to return:
* **Match Percentage:** A quantified compatibility score.
* **Skill Gaps:** Categorized list of missing technologies with severity levels (Low, Medium, High).
* **Technical Prep:** AI-generated interview questions and "ideal" answers tailored to the job's technical stack.

### 🛡️ Edge-Level Security
The application implements a robust security layer using Next.js Middleware:
* **Global Route Protection:** Centralized interception of `/dashboard`, `/results`, and `/reviewresume`.
* **Smart Redirection:** Authenticated users are automatically diverted from auth pages (login/signup) back to their dashboard.
* **Unauthorized API Protection:** Hardened API endpoints to prevent data leakage.

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js 20.x or higher
* MongoDB Atlas Account
* Google AI (Gemini) API Key

### 2. Installation
```bash
git clone [[(https://github.com/yashmodi9998/fitjob.git)](https://github.com/yashmodi9998/fitjob.git)]
cd jobhunt
npm install
```
### 3. Environment Setup

Create a .env.local file in the root directory:

Code snippet
```
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
AUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_SECRET = 
GOOGLE_CLIENT_ID = 
```
4. Run Development
```
Bash
npm run dev
```
