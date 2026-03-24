
import { generateReport } from "@/lib/ai";
import { NextResponse } from "next/server";

const resume = `Yash Modi
Full Stack Web Developer
Toronto, ON |+1(437)661-8091 | Yashmodi998@gmail.com | linkedin.com/in/yashnileshbhaimodi| github.com/yashmodi9998 |modiyash.dev
PROFESSIONAL SUMMARY
Full Stack Web Developer with 3+ years of experience building modern web applications using React, Next.js, TypeScript, and Node.js. Experienced in REST API development, authentication systems and database design. Transitioned from enterprise SAP development to modern JavaScript stack, bringing strong debugging and code review practices to full-stack web development. 
TECHNICAL SKILLS
Languages & Core: JavaScript (ES6+), TypeScript, HTML5, CSS3, PHP
Frontend: React.js (Hooks, Context), Next.js, Tailwind CSS, Bootstrap, Figma
Backend & APIs: Node.js, Express.js, RESTful APIs, JWT, Prisma, Clerk Auth
Databases: PostgreSQL, MongoDB, MySQL
Tools & Platform: Git/GitHub, Docker, GCP, Firebase, Jira, Slack, WordPress
PROFESSIONAL EXPERIENCE
Web Developer (Intern) | Kids World Record Media, Toronto,ON
April 2024 – August 2024 

Contributed to a bidding-based web platform by building and maintaining a Next.js application using TypeScript, Prisma, and Clerk authentication, enabling secure user access and real-time API-driven updates.
Translated Figma designs into responsive Next.js components using Tailwind CSS, applying semantic HTML and accessibility practices while implementing server-side rendering to improve performance
Web Developer | Prelax Infotech, Gujarat,India
November 2022 – May 2023 

Built reusable React components with TypeScript and integrated them with Node.js/Express REST APIs to deliver dynamic, data-driven web applications aligned with client requirements.
Designed backend API endpoints with validation, authentication, and business logic using Express middleware and MongoDB, ensuring reliable data handling and consistent system behavior.
Authored structured API documentation covering request/response formats, authentication flows, and error handling patterns to improve collaboration between frontend and backend teams.
Assistant System Engineer | Tata Consultancy Services (TCS), Gujarat,India
April 2021 – October 2022

Maintained and enhanced legacy SAP ABAP programs to ensure enterprise reports and workflows remained accurate, stable, and aligned with evolving business requirements.
Developed 15+ SAP ABAP reports and Smart Forms based on functional specifications, delivering structured operational and financial data to support business decision-making.
Collaborated in Agile teams through pair programming, code reviews, and daily standups to troubleshoot production issues, improve code quality, and maintain delivery timelines.
Junior Web Developer | Infozium IT Solutions, Gujarat,India
 October 2020 – April 2021

Developed interactive web pages using HTML, CSS, JavaScript, and PHP, implementing server-side form validation and database integration to ensure secure and reliable data processing.
Customized WordPress themes and plugins to support client-specific business logic, improving website functionality while maintaining performance and usability.
KEY PROJECT
CocoTracker - Inventory Management System | Node.js, Express, MongoDB, React.js, JWT   | GitHub
Designed and built a full-stack inventory management system to centralize stock tracking, handle user return requests, and manage administrative approval workflows for small businesses.
Developed RESTful backend APIs using Node.js and Express to manage inventory updates and concurrent user actions, ensuring data consistency and preventing conflicting stock states.
Implemented JWT-based authentication and role-based access control to restrict access based on user roles, strengthening application security and operational control.
EDUCATION
Graduate Certificate in AI with Machine Learning | Humber College
Toronto, ON (2025)
Graduate Certificate in Web Development | Humber College
Toronto, ON (2024)
Bachelor of Engineering in Computer Engineering | C.K.Pithawala College of Engineering and Technology
Gujarat, India (2020)


`;
const jobDescription = `We are seeking a skilled Full Stack Web Developer to join our dynamic team. The ideal candidate will have experience in building modern web applications using React, Next.js, TypeScript, and Node.js. The role involves developing REST APIs, implementing authentication systems, and designing databases. Experience with cloud platforms like GCP or AWS is a plus. The candidate should be able to work collaboratively in an Agile environment and have strong problem-solving skills. Responsibilities include translating Figma designs into responsive components, ensuring code quality through reviews, and maintaining documentation for API endpoints. If you are passionate about web development and eager to contribute to innovative projects, we would love to hear from you.`;
export async function GET(request: Request) {
  const aiResponse = await generateReport({ resume, jobDescription });
  return NextResponse.json({ message: aiResponse });

}