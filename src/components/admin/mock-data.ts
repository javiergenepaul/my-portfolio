import type { ContentRow } from "./admin-config";

/**
 * Prototype mock content — stands in for the Supabase rows until the DB is
 * wired. Localized fields are per-locale maps; some non-English locales are
 * intentionally left blank to show the "missing translation" state in the UI.
 */
export const MOCK_DATA: Record<string, ContentRow[]> = {
  profile: [
    {
      id: "profile",
      published: true,
      order: 0,
      values: {
        fullName: "Gene Paul Mar Javier",
        jobTitle: {
          en: "Full-Stack Software Engineer",
          ja: "フルスタックソフトウェアエンジニア",
        },
        bio: {
          en: "Full-stack software engineer crafting production-ready applications with React & Next.js on the frontend and Spring Boot & Java on the backend.",
          ja: "React & Next.js とSpring Boot & Java で本番対応アプリを構築するフルスタックエンジニア。",
        },
        location: { en: "Cebu, Philippines", ja: "セブ、フィリピン" },
        avatar: "/assets/avatar-profile.jpg",
      },
    },
  ],
  experience: [
    {
      id: "exp-1",
      published: true,
      order: 0,
      values: {
        title: { en: "Software Engineer", ja: "ソフトウェアエンジニア" },
        subtitle: { en: "Kryterion by Drake International" },
        description: {
          en: "Migrated 20+ legacy JSP/Struts screens to Vue.js with Pinia as part of a monolith-to-microservices modernization.",
        },
        employmentType: "Full-time",
        startDate: "2024-09-09",
        endDate: "present",
        watermark: "",
      },
    },
    {
      id: "exp-2",
      published: true,
      order: 1,
      values: {
        title: { en: "Full-Stack Software Developer", ja: "" },
        subtitle: { en: "Magic" },
        description: {
          en: "Optimized backend performance by eliminating N+1 queries and adding caching; integrated AWS SES for transactional email.",
        },
        employmentType: "Part-time",
        startDate: "2025-08-01",
        endDate: "2026-07-01",
        watermark: "",
      },
    },
    {
      id: "exp-3",
      published: true,
      order: 2,
      values: {
        title: { en: "Software Engineer" },
        subtitle: { en: "Alliance Software Inc." },
        description: {
          en: "Built full-stack features for Sirius WebPOS with React, TypeScript, and Spring Boot; implemented JWT auth with Spring Security.",
        },
        employmentType: "Full-time",
        startDate: "2022-12-01",
        endDate: "2024-09-05",
        watermark: "",
      },
    },
  ],
  education: [
    {
      id: "edu-1",
      published: true,
      order: 0,
      values: {
        title: { en: "BS Computer Engineering" },
        subtitle: { en: "University of Cebu – Main Campus" },
        level: "tertiary",
        startDate: "2016-06-01",
        endDate: "2021-07-01",
      },
    },
  ],
  certificates: [
    {
      id: "cert-1",
      published: true,
      order: 0,
      values: {
        title: { en: "Spring Boot 3 Essential Training" },
        organization: { en: "LinkedIn Learning" },
        issuedDate: "2025-01-01",
        credentialId: "",
        credentialUrl: "https://www.linkedin.com/learning/certificates/…",
        logo: "/assets/organization/linkedin-learning.png",
      },
    },
    {
      id: "cert-2",
      published: true,
      order: 1,
      values: {
        title: { en: "Microservices Foundations" },
        organization: { en: "LinkedIn Learning" },
        issuedDate: "2025-01-01",
        credentialId: "",
        credentialUrl: "https://www.linkedin.com/learning/certificates/…",
        logo: "/assets/organization/linkedin-learning.png",
      },
    },
    {
      id: "cert-3",
      published: false,
      order: 2,
      values: {
        title: {
          en: "The Complete Guide 2024 (incl. React Router & Redux)",
        },
        organization: { en: "Udemy" },
        issuedDate: "2024-02-01",
        credentialId: "UC-b320bafd-2898-4c2e-ae3f-3d72564b8a10",
        credentialUrl: "https://udemy-certificate.s3.amazonaws.com/…",
        logo: "/assets/organization/udemy.png",
      },
    },
  ],
  projects: [
    {
      id: "proj-1",
      published: true,
      order: 0,
      values: {
        title: { en: "Palette Shift" },
        description: {
          en: "Open-source demo showcasing dynamic color/branding theming and live multi-language switching.",
        },
        category: "Open source",
        type: "personal",
        status: "completed",
        previewUrl: "https://palette-shift.netlify.app/",
        codeUrl: "https://github.com/javiergenepaul/palette-shift",
      },
    },
    {
      id: "proj-2",
      published: true,
      order: 1,
      values: {
        title: { en: "Rochenette Portfolio" },
        description: {
          en: "Reusable timeline-based portfolio template with year-by-year navigation, 3D scenes, and full i18n.",
        },
        category: "Client",
        type: "client",
        status: "completed",
        previewUrl: "https://rochenette-legaspina-portfolio.vercel.app/",
        codeUrl: "",
      },
    },
  ],
  skills: [
    {
      id: "sk-1",
      published: true,
      order: 0,
      values: {
        name: "Spring Boot",
        category: "backend",
        rating: "8",
        dateStarted: "2022-12-12",
        icon: "/assets/stack-icon/spring-boot.svg",
      },
    },
    {
      id: "sk-2",
      published: true,
      order: 1,
      values: {
        name: "React",
        category: "frontend",
        rating: "10",
        dateStarted: "2022-06-01",
        icon: "/assets/stack-icon/react.svg",
      },
    },
    {
      id: "sk-3",
      published: true,
      order: 2,
      values: {
        name: "TypeScript",
        category: "frontend",
        rating: "10",
        dateStarted: "2022-12-12",
        icon: "/assets/stack-icon/typescript.svg",
      },
    },
    {
      id: "sk-4",
      published: true,
      order: 3,
      values: {
        name: "Docker",
        category: "others",
        rating: "6",
        dateStarted: "2023-02-01",
        icon: "",
      },
    },
  ],
  testimonials: [
    {
      id: "tst-1",
      published: true,
      order: 0,
      values: {
        name: "Jane Doe",
        role: { en: "Engineering Manager" },
        company: "Alliance Software Inc.",
        text: {
          en: "Gene ships features end to end and raises the bar on code quality for the whole team.",
        },
        rating: "5",
        avatar: "",
      },
    },
    {
      id: "tst-2",
      published: false,
      order: 1,
      values: {
        name: "John Smith",
        role: { en: "Product Lead" },
        company: "Magic",
        text: {
          en: "Reliable, fast, and thoughtful about performance. A pleasure to work with.",
        },
        rating: "5",
        avatar: "",
      },
    },
  ],
  books: [
    {
      id: "bk-1",
      published: true,
      order: 0,
      values: {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt, David Thomas",
        quote: {
          en: "Care about your craft. Why spend your life developing software unless you care about doing it well?",
        },
        reflection: {
          en: "Reshaped how I think about ownership and continuous improvement.",
        },
        theme: "Systems",
      },
    },
    {
      id: "bk-2",
      published: true,
      order: 1,
      values: {
        title: "Deep Work",
        author: "Cal Newport",
        quote: { en: "Clarity about what matters provides clarity about what does not." },
        reflection: { en: "Made me protect focus time ruthlessly." },
        theme: "Focus",
      },
    },
  ],
  languages: [
    {
      id: "lng-1",
      published: true,
      order: 0,
      values: {
        name: "English",
        nativeName: "English",
        level: "Fluent",
        note: { en: "Primary working language." },
        flagIcon: "",
      },
    },
    {
      id: "lng-2",
      published: true,
      order: 1,
      values: {
        name: "Cebuano",
        nativeName: "Bisaya",
        level: "Native",
        note: { en: "Mother tongue." },
        flagIcon: "",
      },
    },
  ],
  services: [
    {
      id: "svc-1",
      published: true,
      order: 0,
      values: {
        title: { en: "Full-Stack Web Development" },
        description: {
          en: "End-to-end web apps with React/Next.js and Spring Boot.",
        },
      },
    },
    {
      id: "svc-2",
      published: true,
      order: 1,
      values: {
        title: { en: "API & Microservices" },
        description: {
          en: "REST APIs, JWT auth, and monolith-to-microservices migrations.",
        },
      },
    },
  ],
  socials: [
    {
      id: "soc-1",
      published: true,
      order: 0,
      values: {
        platform: "GitHub",
        url: "https://github.com/javiergenepaul",
      },
    },
    {
      id: "soc-2",
      published: true,
      order: 1,
      values: {
        platform: "LinkedIn",
        url: "https://www.linkedin.com/in/gene-paul-mar-javier-500b93245/",
      },
    },
  ],
  "resume-overview": [
    {
      id: "resume-overview",
      published: true,
      order: 0,
      values: {
        summary:
          "Full-stack software engineer with 5 years of experience building SaaS and enterprise web applications with React, TypeScript, and Spring Boot. Delivered JWT-secured REST APIs, monolith-to-microservices migrations, and multi-branch retail POS platforms.",
        phone: "+63 976 291 2231",
        email: "javiergenepaul@gmail.com",
        location: "Cebu, Philippines",
        links: [
          { platform: "github", url: "https://github.com/javiergenepaul" },
          {
            platform: "linkedin",
            url: "https://linkedin.com/in/gene-paul-mar-javier",
          },
        ],
      },
    },
  ],
  "resume-experience": [
    {
      id: "rexp-1",
      published: true,
      order: 0,
      values: {
        role: "Software Engineer",
        company: "Kryterion by Drake International",
        employmentType: "Full-time",
        location: "Cebu, Philippines",
        period: "Sep 2024 – Present",
        promotion: "",
        bullets: [
          "Migrated 20+ complex legacy JSP / Apache Struts screens to a modern Vue.js frontend with Pinia state management.",
          "Develop scalable web applications using Spring Boot (Java) and Vue.js.",
          "Perform code reviews, unit testing, and integration testing to ensure high-quality delivery.",
        ],
      },
    },
    {
      id: "rexp-2",
      published: true,
      order: 1,
      values: {
        role: "Software Engineer",
        company: "Alliance Software Inc.",
        employmentType: "Full-time",
        location: "Cebu, Philippines",
        period: "Dec 2022 – Sep 2024",
        promotion: "Promoted to Associate Technical Specialist I (Jan 2024)",
        bullets: [
          "Built and maintained full-stack features for Sirius WebPOS using React, TypeScript, and Spring Boot.",
          "Implemented JWT-based authentication and authorization with Spring Security.",
          "Introduced Jest and Cypress test suites that cut UI regression bugs in QA.",
        ],
      },
    },
  ],
  "resume-projects": [
    {
      id: "rproj-1",
      published: true,
      order: 0,
      values: {
        name: "Palette Shift",
        context: "Open source",
        url: "https://palette-shift.netlify.app/",
        bullets: [
          "Open-source demo showcasing dynamic color / branding theming and live multi-language switching.",
        ],
        stack: ["React", "TypeScript", "Tailwind CSS", "Zustand", "Vitest"],
      },
    },
  ],
  "resume-skills": [
    {
      id: "rskill-1",
      published: true,
      order: 0,
      values: {
        label: "Languages",
        items: ["Java", "TypeScript", "JavaScript", "PHP", "SQL", "MySQL"],
      },
    },
    {
      id: "rskill-2",
      published: true,
      order: 1,
      values: {
        label: "Backend",
        items: [
          "Spring Boot",
          "Spring Security",
          "REST API design",
          "JWT",
          "Microservices",
        ],
      },
    },
    {
      id: "rskill-3",
      published: true,
      order: 2,
      values: {
        label: "Frontend",
        items: ["React", "Next.js", "Vue.js", "Nuxt.js", "Tailwind CSS"],
      },
    },
  ],
  "resume-education": [
    {
      id: "redu-1",
      published: true,
      order: 0,
      values: {
        degree: "BS Computer Engineering",
        school: "University of Cebu – Main Campus",
        period: "2016 – 2021",
      },
    },
  ],
  "resume-certifications": [
    {
      id: "rcert-1",
      published: true,
      order: 0,
      values: {
        issuer: "LinkedIn Learning",
        year: "2025",
        titles: [
          "Spring Boot 3 Essential Training",
          "Microservices Foundations",
          "Agile Software Development: Code Quality",
        ],
      },
    },
  ],
};

export function getMockRows(typeKey: string): ContentRow[] {
  return MOCK_DATA[typeKey] ?? [];
}

export function getMockRow(
  typeKey: string,
  id: string,
): ContentRow | undefined {
  return getMockRows(typeKey).find((r) => r.id === id);
}
