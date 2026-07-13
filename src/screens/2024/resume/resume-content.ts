import { FULL_NAME, JOB_TITLE, EMAIL_ADDRESS } from "@/config";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";

/**
 * Resume-specific content for the ATS template.
 *
 * Deliberately NOT sourced from the shared portfolio config (`about.*`,
 * `projects.*`): that copy is portfolio marketing prose (first-person,
 * storytelling) which reads wrong on a resume. This module holds tight,
 * achievement-oriented, ATS-friendly text instead.
 *
 * NOTE ON METRICS: figures here are user-confirmed (e.g. "20+ screens", the
 * 100% coverage target). The Sirius WebPOS adoption count is intentionally
 * omitted — it wasn't known first-hand. Don't add invented numbers.
 */

export interface ResumeExperience {
  role: string;
  company: string;
  employmentType: string;
  location: string;
  period: string;
  /** Optional single-line promotion signal shown under the header. */
  promotion?: string;
  bullets: string[];
}

export interface ResumeProject {
  name: string;
  /** Short context tag, e.g. "Open source" or "Personal". */
  context?: string;
  url?: string;
  bullets: string[];
  stack: string[];
}

export interface ResumeEducation {
  degree: string;
  school: string;
  period: string;
}

export interface ResumeSkillGroup {
  label: string;
  items: string[];
}

export interface ResumeCertGroup {
  issuer: string;
  year: string;
  titles: string[];
}

// ── Header / contact ────────────────────────────────────────────────────────

export const RESUME_NAME = FULL_NAME;
export const RESUME_TITLE = JOB_TITLE;

export const RESUME_CONTACT = {
  phone: "+63 976 291 2231",
  email: EMAIL_ADDRESS,
  location: "Cebu, Philippines",
  github: { label: "github.com/javiergenepaul", url: GITHUB_URL },
  linkedin: {
    label: "linkedin.com/in/gene-paul-mar-javier",
    url: LINKED_IN_URL,
  },
} as const;

// ── Summary — hard facts, no storytelling ────────────────────────────────────

export const RESUME_SUMMARY =
  "Full-stack software engineer with 5 years of experience building SaaS and enterprise web applications with React, TypeScript, and Spring Boot. Delivered JWT-secured REST APIs, monolith-to-microservices migrations, and multi-branch retail POS platforms. Owns features end to end in remote, cross-functional teams.";

// ── Experience — action verb + what + (measurable) outcome ───────────────────

export const RESUME_EXPERIENCE: ResumeExperience[] = [
  {
    role: "Software Engineer",
    company: "Kryterion by Drake International",
    employmentType: "Full-time",
    location: "Cebu, Philippines",
    period: "Sep 2024 – Present",
    bullets: [
      "Migrated 20+ complex legacy JSP / Apache Struts screens to a modern Vue.js frontend with Pinia state management as part of a monolith-to-microservices modernization.",
      "Develop scalable web applications using Spring Boot (Java) and Vue.js.",
      "Perform code reviews, unit testing, and integration testing to ensure high-quality software delivery.",
      "Collaborate with cross-functional teams to gather requirements and deliver solutions that meet business needs.",
      "Resolve Tech Debts by Upgrading Dependencies, Refactoring Code, and Improving Test Coverage.",
      "Volunteer on a high paced team to deliver new features and enhancements to the Kryterion platform, improving user experience and functionality.",
    ],
  },
  {
    role: "Full-Stack Software Developer",
    company: "Magic",
    employmentType: "Part-time · Remote",
    location: "Remote",
    period: "Aug 2025 – July 2026",
    bullets: [
      "Optimized backend performance by eliminating N+1 queries and adding caching, and reworked reports-page calculations to cut load times.",
      "Built transactional email templates and integrated AWS SES for reliable delivery.",
      "Revamped existing pages and shipped new responsive features, deployed automatically via Vercel.",
      "Implemented Amazon SES for transactional email delivery, ensuring reliable communication with users.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Alliance Software Inc.",
    employmentType: "Full-time",
    location: "Cebu, Philippines",
    period: "Dec 2022 – Sep 2024",
    promotion: "Promoted to Associate Technical Specialist I (Jan 2024)",
    bullets: [
      "Built and maintained full-stack features for Sirius WebPOS, a multi-branch retail point-of-sale platform, using React, TypeScript, and Spring Boot.",
      "Implemented JWT-based authentication and authorization with Spring Security.",
      "Introduced Jest and Cypress test suites that cut UI regression bugs in QA and raised release confidence.",
      "Deployed and maintained services on Linux / CentOS with Azure Pipelines CI/CD.",
      "Mentored junior developers and conducted code reviews to ensure code quality and best practices.",
    ],
  },
  {
    role: "Software Developer",
    company: "Mach95 Software Development Corporation",
    employmentType: "Full-time",
    location: "Cebu, Philippines",
    period: "Jul 2021 – Dec 2022",
    bullets: [
      "Developed dynamic web applications and RESTful APIs with Laravel 8 and CodeIgniter (PHP).",
      "Built YooPH, a delivery and e-commerce platform, delivering both customer-facing and admin interfaces.",
      "Created responsive, pixel-accurate landing pages with Tailwind CSS.",
    ],
  },
  {
    role: "VR/AR Developer & 3D Modeler",
    company: "Exodia Game Development",
    employmentType: "Part-time",
    location: "Cebu, Philippines",
    period: "Jul 2019 – Jul 2021",
    bullets: [
      "Built interactive VR/AR experiences and 3D environments in Unreal Engine 4 and Unity.",
      "Created 3D models and assets for games and applications using Blender.",
    ],
  },
];

// ── Projects — personal / open-source, verifiable (no job overlap) ───────────

export const RESUME_PROJECTS: ResumeProject[] = [
  {
    name: "Palette Shift",
    context: "Open source",
    url: "https://palette-shift.netlify.app/",
    bullets: [
      "Open-source demo showcasing dynamic color / branding theming and live multi-language switching.",
    ],
    stack: ["React", "TypeScript", "Tailwind CSS", "Zustand", "Vitest"],
  },
  {
    name: "Rochenette Portfolio",
    context: "Open source",
    url: "https://rochenette-legaspina-portfolio.vercel.app/2026/en",
    bullets: [
      "Built a reusable, timeline-based portfolio template with year-by-year navigation, 3D scenes (Three.js), motion, and full i18n across four locales.",
      "Adapted the shared template into a bespoke, branded portfolio delivered for an individual client.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js"],
  },
  {
    name: "Yong Portfolio",
    context: "Open source",
    url: "https://yongbenitez.netlify.app/",
    bullets: [
      "Reskinned and shipped the same portfolio template for a second client, tailoring content, branding, and layout while reusing the shared component architecture.",
      "Maintained responsive design and multi-locale support across the client build.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js"],
  },
];

// ── Skills — cleaned casing, ATS keywords, no filler ─────────────────────────

export const RESUME_SKILLS: ResumeSkillGroup[] = [
  {
    label: "Languages",
    items: ["Java", "TypeScript", "JavaScript", "PHP", "SQL", "MySQL"],
  },
  {
    label: "Backend",
    items: [
      "Spring Boot",
      "Spring Security",
      "Spring Data JDBC",
      "REST API design",
      "JWT (JSON Web Token)",
      "Microservices",
    ],
  },
  {
    label: "Frontend",
    items: [
      "React",
      "Next.js",
      "Vue.js",
      "Nuxt.js",
      "Tailwind CSS",
      "HTML",
      "CSS",
      "Responsive design",
      "Zustand",
      "Pinia",
      "React Query",
    ],
  },
  {
    label: "Testing & QA",
    items: [
      "Jest",
      "Vitest",
      "Cypress",
      "JUnit",
      "Postman",
      "Unit & integration testing",
    ],
  },
  {
    label: "DevOps & Tools",
    items: [
      "Git",
      "Linux",
      "Nginx",
      "AWS",
      "Agile / Scrum",
      "Jira",
      "Asana",
      "TFS"
    ],
  },
];

// ── Education — degree only; OLTEC (2015) cut as advised ──────────────────────

export const RESUME_EDUCATION: ResumeEducation[] = [
  {
    degree: "BS Computer Engineering",
    school: "University of Cebu – Main Campus",
    period: "2016 – 2021",
  },
];

// ── Certifications — senior-relevant only ────────────────────────────────────
// Beginner "Learning React / TypeScript / Next.js / Vue.js" courses are
// intentionally omitted: listing an intro course next to years of that same
// skill signals junior. Kept the ones that reinforce differentiators.

export const RESUME_CERTIFICATIONS: ResumeCertGroup[] = [
  {
    issuer: "LinkedIn Learning",
    year: "2025",
    titles: [
      "Spring Boot 3 Essential Training",
      "Microservices Foundations",
      "Agile Software Development: Code Quality",
    ],
  },
];
