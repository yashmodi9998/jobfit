# 🚀 JobFit:Resume Gap Analyzer

JobFit is a full-stack SaaS application designed to bridge the gap between job seekers and their dream roles. By leveraging **Google Gemini AI**, the platform provides deep-level analysis of how well a candidate's resume aligns with a specific Job Description (JD).

## ✨ Key Features

* **AI Gap Analysis:** Instant match percentage calculation based on technical skills, experience, and keywords.
* **Resume Optimization:** Automatically generates a revised, ATS-friendly resume layout using `@react-pdf/renderer`.
* **Interview Preparation:** Curates 10+ custom technical questions and "Ideal Answers" tailored to the specific job and candidate profile.
* **Secure Dashboard:** Personalized user accounts with history tracking.
* **Smart PDF Parsing:** Server-side extraction of text from uploaded PDF documents.

## 🛠️ Tech Stack

* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **AI Engine:** Google Gemini Pro
* **Database:** MongoDB (via Mongoose)
* **Authentication:** NextAuth.js
* **Styling:** Tailwind CSS + Shadcn 
* **PDF Generation:** React-PDF

## 🛡️ Security Features

* **IDOR Prevention:** All database queries are scoped to the authenticated `userId`.
* **Server-Side Validation:** User sessions are verified on every API request and Page Load.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yashmodi9998/jobfit.git
cd jobfit

```

### 2. Install dependencies

```bash
npm install

```

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
MONGODB_URI=your_mongodb_uri
AUTH_SECRET=your_nextauth_secret
GEMINI_API_KEY=your_google_gemini_key
NEXTAUTH_URL= your_callback_url
GOOGLE_CLIENT_SECRET = google_client_secret_key
GOOGLE_CLIENT_ID = google_client_id

```

### 4. Run the development server

```bash
npm run dev

```
