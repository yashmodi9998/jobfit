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

* All database queries are scoped to the authenticated `userId`.
*  User sessions are verified on every API request and Page Load.

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
### 5. Screenshots
<img width="1409" height="831" alt="Screenshot 2026-03-07 at 2 29 12 PM" src="https://github.com/user-attachments/assets/9364cc23-a63d-49e5-ba3f-6153427f80e5" />

<img width="1409" height="831" alt="Screenshot 2026-03-07 at 2 30 18 PM" src="https://github.com/user-attachments/assets/0a685940-685d-47ca-bc90-6bc3511888e6" />

![1772912376426-4762c890-aba3-4aba-a0c2-6598e5839c3c_1](https://github.com/user-attachments/assets/46e55be7-171f-4f7f-adcb-2817aaab07f7)
![1772912376426-4762c890-aba3-4aba-a0c2-6598e5839c3c_2](https://github.com/user-attachments/assets/ed6a0dc5-ef7c-4cde-a48b-68a4df794e6d)
![1772912376426-4762c890-aba3-4aba-a0c2-6598e5839c3c_3](https://github.com/user-attachments/assets/4adfa2c7-9a15-4070-abcd-1825757ed772)




