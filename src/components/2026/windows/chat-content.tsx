"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Sparkles, Square, TriangleAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FULL_NAME, JOB_TITLE, EMAIL_ADDRESS } from "@/config/data/personal";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";
import { translate, useLocaleRefresh } from "@/i18n";
import { useLanguageStore } from "@/stores";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
}

// ── Knowledge base engine ─────────────────────────────────────────────────────


/**
 * Token-based scoring matcher.
 * Each KB entry has a list of keyword strings (single words or short phrases).
 * The input is normalised → tokenised into words + bigrams.
 * Phrases (multi-word keys) count for 2 points; single words count for 1.
 * The entry with the highest score wins; ties go to the first entry (priority order).
 *
 * Array replies cycle in order — asking the same question again always gives
 * the next reply instead of repeating randomly.
 */
type KBEntry = { keys: string[]; reply: string | string[] };

// Tracks how many times each KB index has been matched, for reply cycling
const kbCounters = new Map<number, number>();
// Cycles fallbacks too
let fallbackCounter = 0;

function tokenize(raw: string): Set<string> {
  const s = raw.toLowerCase().replace(/[''`]/g, "").replace(/[^a-z0-9\s]/g, " ");
  const words = s.split(/\s+/).filter(Boolean);
  const set = new Set<string>(words);
  for (let i = 0; i < words.length - 1; i++) set.add(`${words[i]} ${words[i + 1]}`);
  return set;
}

function matchKB(raw: string): string {
  const tokens = tokenize(raw);
  const norm = raw.toLowerCase();
  let bestIdx = -1;
  let bestScore = 0;
  for (let i = 0; i < KB.length; i++) {
    let score = 0;
    for (const key of KB[i].keys) {
      if (key.includes(" ")) {
        if (norm.includes(key)) score += 2;
      } else {
        if (tokens.has(key)) score += 1;
      }
    }
    if (score > bestScore) { bestScore = score; bestIdx = i; }
  }
  if (bestIdx === -1) {
    const reply = FALLBACKS[fallbackCounter % FALLBACKS.length];
    fallbackCounter++;
    return reply;
  }
  const r = KB[bestIdx].reply;
  if (typeof r === "string") return r;
  const count = kbCounters.get(bestIdx) ?? 0;
  kbCounters.set(bestIdx, count + 1);
  return r[count % r.length];
}

const FALLBACKS = [
  "Hmm, I'm not sure about that! Try asking about GPM's skills, experience, projects, or how to contact him. 🤔",
  "That's outside my knowledge base. Ask me about GPM's work history, tech stack, education, or how to reach him!",
  "I don't have info on that. But I know everything about Gene Paul Mar Javier — want to try a different question?",
];

// ── Knowledge base ───────────────────────────────────────────────────────────

const KB: KBEntry[] = [
  // Greetings
  {
    keys: ["hello", "hi", "hey", "howdy", "yo", "greetings", "sup", "hiya", "heya", "good morning", "good afternoon", "good evening"],
    reply: [
      `Hey there! 👋 I'm ChatGPM. Ask me anything about ${FULL_NAME} — skills, experience, projects, or how to hire him!`,
      "Hello! I'm here to tell you all about GPM. What would you like to know?",
    ],
  },
  // About the bot
  {
    keys: ["who are you", "what are you", "your purpose", "what can you do", "how do you work", "chatgpm", "chat gpm", "are you ai", "are you bot", "what is chatgpm", "what does chatgpm mean", "what does gpm stand for", "generative personal machine", "gene paul model", "what does it stand for", "what is gpm", "meaning of chatgpm", "chatgpm meaning"],
    reply: `I'm ChatGPM — the built-in AI assistant for ${FULL_NAME}'s portfolio 🤖\n\nThe name has a double meaning:\n• 🧠 Generative Personal Machine — a nod to GPT-style AI\n• 👤 Gene Paul Model — literally powered by knowledge about Gene Paul Mar Javier\n\nNo external API. No hallucinations (hopefully). Just GPM's knowledge, distilled into code. Ask me anything about his skills, experience, projects, or how to hire him!`,
  },
  // About GPM
  {
    keys: ["who is gpm", "who is gene", "about gene", "about gpm", "tell me about", "introduce", "gene paul", "gpm", "who is he", "who are you talking about"],
    reply: [
      `${FULL_NAME} (GPM) is a ${JOB_TITLE} from Cebu, Philippines 🇵🇭\n\nWith 7+ years of experience, he builds polished web apps using React, Next.js, and TypeScript on the frontend — and Java + Spring Boot on the backend. Known for his eye for detail and love of immersive, interactive interfaces.`,
      `GPM (${FULL_NAME}) is a ${JOB_TITLE} based in Cebu, Philippines 🇵🇭\n\n7+ years building production-grade apps across the full stack — React & Next.js on the frontend, Java & Spring Boot on the backend. He's the kind of developer who makes UIs feel alive.`,
    ],
  },
  // Full name
  {
    keys: ["full name", "real name", "complete name", "his name", "your name"],
    reply: `His full name is ${FULL_NAME} — but everyone calls him GPM! 😄`,
  },
  // Job title / role
  {
    keys: ["job title", "position", "role", "what does he do", "what is he", "his job", "his role", "profession", "occupation"],
    reply: `GPM's title is ${JOB_TITLE} 💻\n\nHe works across the full stack — building sleek frontends with React & Next.js and robust backends with Java & Spring Boot.`,
  },
  // Skills (general — lower priority than frontend/backend specifics)
  {
    keys: ["skills", "tech", "stack", "expertise", "technologies", "tools", "what does he know", "what can he do", "proficient", "tech stack"],
    reply: `GPM's tech stack 🛠\n\n🎨 Frontend — React · Next.js · TypeScript · Tailwind CSS · Framer Motion · Three.js · GSAP · Zustand · ShadCN\n⚙️ Backend — Java · Spring Boot · Spring Security · MySQL · REST APIs · Microservices\n🎨 Design — Figma\n🛠 Tools — Git · Vite · Azure · AWS · Linux`,
  },
  // Frontend
  {
    keys: ["frontend", "front end", "react", "nextjs", "next js", "typescript", "tailwind", "framer", "threejs", "three js", "gsap", "zustand", "shadcn", "css", "html", "javascript", "ui", "animation", "framer motion"],
    reply: `Frontend skills 🎨\n\nReact · Next.js · TypeScript · JavaScript · Tailwind CSS · ShadCN/UI · Framer Motion · Three.js · GSAP · Zustand · MobX · React Query · Vite · i18n\n\nHe converts Figma designs into pixel-perfect, animated interfaces — like this very portfolio!`,
  },
  // Backend
  {
    keys: ["backend", "back end", "java", "spring boot", "spring", "api", "rest", "mysql", "sql", "database", "microservices", "laravel", "php", "server", "server side"],
    reply: `Backend chops ⚙️\n\nJava · Spring Boot · Spring Security · Spring OAuth · MySQL · REST APIs · Microservices · Laravel · PHP\n\nHe builds scalable, secure server-side systems with a focus on clean architecture.`,
  },
  // DevOps / Cloud
  {
    keys: ["devops", "cloud", "azure", "aws", "linux", "nginx", "deploy", "deployment", "ci cd", "pipeline", "firebase", "netlify", "heroku", "centos"],
    reply: `DevOps & Cloud ☁️\n\nAzure · Azure Pipelines · AWS · Linux · Nginx · CentOS · Firebase · Netlify · Heroku · Git\n\nGPM has deployed and maintained production apps on cloud infrastructure, managed CI/CD pipelines, and configured Linux servers.`,
  },
  // Testing
  {
    keys: ["testing", "test", "jest", "cypress", "vitest", "junit", "postman", "unit test", "e2e"],
    reply: `Testing skills 🧪\n\nJest · Vitest · Cypress · JUnit · Postman\n\nGPM writes unit tests, end-to-end tests, and API tests to ship with confidence.`,
  },
  // Figma / Design
  {
    keys: ["figma", "design", "ui design", "ux", "pixel perfect", "mockup", "prototype", "design to code", "figma to code"],
    reply: `Design skills 🎨\n\nGPM is fluent in Figma — he turns mockups into pixel-perfect, interactive React components.\n\nHe's done:\n• Figma → HTML/CSS\n• Figma → React (pixel-perfect)\n• UI/UX exploration & prototyping\n• Landing page design implementation\n\nIf you give him a Figma file, he'll give you production-ready code.`,
  },
  // Years of experience
  {
    keys: ["how long", "years of experience", "how many years", "years experience", "since when", "career start", "when did he start", "how experienced", "experience level"],
    reply: `GPM has been building professional software since 2018 — that's 7+ years in the industry! 🏆\n\nHis journey: game development → frontend engineering → full-stack. Each step leveled up his craft.`,
  },
  // Full work history
  {
    keys: ["work history", "career history", "career path", "career timeline", "all companies", "all experience", "full experience", "full history", "where has he worked", "companies he worked"],
    reply: `Full career timeline 📋\n\n🚀 Magic — Full Stack Dev (Aug 2025–present · Part-time)\n💼 Kryterion — Software Engineer (Sep 2024–present · Full-time)\n🏢 Alliance Software — Engineer (Dec 2022–Sep 2024 · Full-time)\n⚡ Mach95 — Frontend Dev (Jul 2021–Dec 2022 · Full-time)\n🎮 Exodia Game Dev — Frontend Dev (Jul 2019–Jul 2021 · Part-time)`,
  },
  // Experience (general — lower priority)
  {
    keys: ["experience", "career", "where does he work", "where does he work", "work"],
    reply: `Career timeline 📋\n\n🚀 Magic — Full Stack Dev (Aug 2025–present · Part-time)\n💼 Kryterion — Software Engineer (Sep 2024–present · Full-time)\n🏢 Alliance Software — Engineer (Dec 2022–Sep 2024 · Full-time)\n⚡ Mach95 — Frontend Dev (Jul 2021–Dec 2022 · Full-time)\n🎮 Exodia Game Dev — Frontend Dev (Jul 2019–Jul 2021 · Part-time)`,
  },
  // First job
  {
    keys: ["first job", "first company", "first role", "first work", "started career", "how did he start", "early career", "beginning of career", "career began", "first ever"],
    reply: `GPM's first professional role was at Exodia Game Dev 🎮\n\nHe joined as a Part-time Frontend Developer in July 2019 while still finishing his degree at the University of Cebu. He built interactive UIs for game projects — which planted the seed for his love of immersive, animated interfaces.\n\nExodia was where the 7-year journey began!`,
  },
  // Current job
  {
    keys: ["current job", "current work", "current company", "current role", "currently working", "working now", "employer", "where does he work now", "latest job"],
    reply: `GPM currently holds two roles simultaneously:\n\n💼 Kryterion — Full-time Software Engineer (since Sep 2024)\n🚀 Magic — Part-time Full Stack Developer (since Aug 2025)\n\nBusy building great software on both fronts!`,
  },
  // Kryterion
  {
    keys: ["kryterion"],
    reply: `Kryterion 💼\n\nA global online testing & exam delivery platform. GPM joined as a full-time Software Engineer in September 2024.\n\nKey contributions:\n• Rebuilt core exam delivery UI with React + TypeScript for performance\n• Integrated Spring Boot microservices for secure test sessions\n• Improved test-taker accessibility and cross-browser compatibility\n• Contributed to CI/CD pipeline improvements`,
  },
  // Magic
  {
    keys: ["magic", "magic company", "magic job"],
    reply: `Magic 🚀\n\nA modern SaaS platform with AI-powered features. GPM joined part-time as a Full Stack Developer in August 2025.\n\nKey contributions:\n• Built full-stack features with Next.js and Java Spring Boot\n• Shipped clean, production-ready code in a remote async workflow\n• Integrated AI-assisted tooling into the product pipeline\n• Maintained high code quality in a fast-paced environment`,
  },
  // Alliance
  {
    keys: ["alliance", "alliance software", "alliance inc"],
    reply: `Alliance Software Inc. 🏢\n\nA Philippine IT solutions company. GPM worked full-time from Dec 2022 to Sep 2024, growing from Software Engineer (TS1) → Associate Technical Specialist (ATS1).\n\nKey contributions:\n• Led frontend development for enterprise client dashboards\n• Architected reusable React component libraries used across 3+ projects\n• Mentored junior developers on TypeScript and React best practices\n• Delivered projects on time with cross-functional teams`,
  },
  // Mach95
  {
    keys: ["mach95", "mach 95", "mach"],
    reply: `Mach95 ⚡\n\nGPM worked full-time as a Frontend Developer from Jul 2021 to Dec 2022 — right after graduating university.\n\nKey contributions:\n• Built responsive marketing and product pages with React and Tailwind CSS\n• Turned Figma designs into pixel-perfect, animated web experiences\n• Collaborated closely with designers to maintain brand consistency\n• Sharpened frontend fundamentals and Agile workflow skills`,
  },
  // Exodia
  {
    keys: ["exodia", "game dev", "exodia game"],
    reply: `Exodia Game Dev 🎮\n\nGPM's first role — part-time Frontend Developer from Jul 2019 to Jul 2021, while still studying at University of Cebu.\n\nKey contributions:\n• Built interactive UI components for game projects using HTML/CSS/JS\n• Developed a strong eye for interactive, game-like user experiences\n• Learned version control, collaborative development, and UI polish\n• This role sparked his passion for building UIs that feel alive!`,
  },
  // Affiliated companies
  {
    keys: ["affiliated", "all companies", "companies he been", "companies affiliated", "list of companies", "every company", "where all"],
    reply: `All companies GPM has been affiliated with 🏢\n\n🚀 Magic — Full Stack Dev (Aug 2025–present)\n💼 Kryterion — Software Engineer (Sep 2024–present)\n🏢 Alliance Software — Software Engineer → ATS1 (Dec 2022–Sep 2024)\n⚡ Mach95 — Frontend Developer (Jul 2021–Dec 2022)\n🎮 Exodia Game Dev — Frontend Dev (Jul 2019–Jul 2021)\n\n5 companies, 7+ years, non-stop growth!`,
  },
  // Greatest achievements
  {
    keys: ["achievement", "achievements", "greatest achievement", "best achievement", "proud of", "accomplishment", "milestone", "biggest win", "success", "impressive"],
    reply: `GPM's greatest achievements 🏆\n\n🎨 Built this portfolio — a fully interactive macOS-style desktop with draggable windows, 3D live wallpapers, AI chat, and a resume builder. All in TypeScript + Next.js.\n\n⬆️ Promoted from TS1 → ATS1 at Alliance Software within 2 years.\n\n🌐 Holds two production roles simultaneously: Kryterion (full-time) + Magic (part-time).\n\n🎮 Started career while still in college at Exodia Game Dev — rare for a developer in 2019.\n\n📚 Self-taught Three.js, Framer Motion, and advanced animation techniques beyond formal education.`,
  },
  // Key contributions
  {
    keys: ["contribution", "contributions", "key contribution", "key contributions", "impact", "what he contributed", "what did he do", "main impact"],
    reply: `GPM's key contributions across his career 💡\n\n• Rebuilt enterprise dashboards with React + TypeScript (Alliance)\n• Architected reusable component libraries used across multiple projects\n• Pixel-perfect Figma → React implementations — consistently\n• Built full-stack features with Spring Boot microservices\n• Mentored junior developers and raised team code quality\n• Contributed to CI/CD pipelines and developer tooling\n• Created this portfolio — a showcase of modern frontend engineering\n\nHe doesn't just ship features — he raises the quality bar.`,
  },
  // Education
  {
    keys: ["education", "school", "university", "degree", "college", "graduated", "study", "studied", "academic", "uc cebu", "university of cebu", "bs it", "bs information technology"],
    reply: `Education background 🎓\n\nUniversity of Cebu — BS Information Technology (2016–2021)\nCebu Technological University — Vocational IT (2015–2016)\nBohol National High School — Secondary (2011–2015)`,
  },
  // Location
  {
    keys: ["location", "where is he", "where from", "where does he live", "where based", "cebu", "philippines", "country", "city", "timezone", "time zone"],
    reply: `GPM is based in Cebu, Philippines 🇵🇭\n\nCebu is one of the most beautiful islands in Southeast Asia! He works remotely with global clients and teams across different time zones.`,
  },
  // Contact
  {
    keys: ["contact", "email", "reach out", "get in touch", "how to contact", "linkedin", "github", "social", "connect", "message him", "reach him"],
    reply: `Want to connect with GPM? 📬\n\n📧 ${EMAIL_ADDRESS}\n💼 ${LINKED_IN_URL}\n🐙 ${GITHUB_URL}\n\nHe's responsive and open to interesting projects!`,
  },
  // Hire / open to work
  {
    keys: ["hire", "hiring", "available", "open to work", "freelance", "opportunity", "opportunities", "for hire", "looking for work", "job offer", "collaborate", "consulting"],
    reply: `Yes! GPM is open to new opportunities 🟢\n\nWhether it's full-time, freelance, or consulting — he's interested in impactful projects. Reach out at ${EMAIL_ADDRESS} to start a conversation!`,
  },
  // Services
  {
    keys: ["services", "what services", "what does he offer", "what can he do for me", "offerings", "offer", "service", "what he offers", "hire him for", "what to hire him for", "service offerings"],
    reply: `GPM offers 3 core services 🛠\n\n⚙️ Backend Development\nScalable server-side systems built with Java · Spring Boot · Spring Security · MySQL · REST APIs · Microservices · Laravel · PHP · Azure · Firebase\n\n🎨 Frontend Development\nPolished, performant UIs with React · Next.js · TypeScript · Tailwind CSS · ShadCN/UI · Framer Motion · Three.js · GSAP · Zustand · Vite · and more\n\n🖼 Design Implementation\nPixel-perfect Figma → React/HTML conversion with meticulous attention to detail — landing pages, interactive UIs, responsive layouts\n\nNeed something built? Reach out at ${EMAIL_ADDRESS}!`,
  },
  // Certificates
  {
    keys: ["certificate", "certificates", "certification", "certifications", "credential", "credentials", "certified", "courses", "course", "linkedin learning", "udemy", "training", "what courses", "what certifications"],
    reply: `GPM's certifications 📜\n\n🔷 LinkedIn Learning (Jan 2025)\n• Learning Nuxt.js\n• Building Modern Projects with React\n• Spring Boot 3 Essential Training\n• Microservices Foundations\n• Tailwind CSS 4 Essential Training\n• Agile Software Development: Code Quality\n• Learning Vue.js\n• Learning Next.js\n• Learning TypeScript\n\n🟠 Udemy\n• React - The Complete Guide (Feb 2024)\n• Spring Boot 3, Spring 6 & Hibernate (Dec 2022)\n\n🏢 Lilolele Incorporated\n• Business Communication Certificate (Jul 2024)\n\nHe keeps sharpening his skills — always learning!`,
  },
  // Projects
  {
    keys: ["projects", "project", "portfolio projects", "what he built", "what he created", "what he developed", "showcase", "sirius", "palette shift", "yooph", "hoobank", "iqmk", "exo portal"],
    reply: `GPM has shipped everything from SaaS platforms to game UIs! 🛠\n\nNotable projects:\n• Sirius WebPOS — Enterprise Java + React point-of-sale system\n• Magic UI — Full-stack SaaS platform revamp (Next.js + Spring Boot)\n• Palette Shift — Color accessibility tool (React + Tailwind)\n• YooPH — Delivery & e-commerce platform (Laravel)\n• This Portfolio — Interactive macOS-style desktop in Next.js\n\nOpen the Projects app for the full showcase!`,
  },
  // This portfolio
  {
    keys: ["this portfolio", "this website", "this site", "portfolio tech", "how is this made", "how was this built", "built this", "made this", "portfolio built with", "portfolio stack"],
    reply: `This 2026 portfolio is built with:\n\n⚡ Next.js 15 (App Router)\n💅 Tailwind CSS v4\n🎬 Framer Motion\n🌐 Three.js / React Three Fiber\n🔤 TypeScript (strict)\n✨ ShadCN/UI · Zustand · next-intl\n\nEvery window is draggable, resizable, and minimizable — just like a real macOS desktop!`,
  },
  // Hobbies
  {
    keys: ["hobby", "hobbies", "free time", "interest", "interests", "passion", "outside work", "personal life", "fun", "leisure", "gaming", "travel"],
    reply: [
      `GPM's hobbies — buckle up 🎒\n\n💻 Coding for fun — yes, he codes at work AND at home. By choice. Voluntarily.\n📚 Learning for fun — tutorials, docs, random rabbit holes at midnight\n🎮 Gaming — Tekken 8 specifically, and he will beat you\n🏍️ Motorcycle rides — the only time he's not in front of a screen\n📖 Reading manga & manhwa — the other time he's not in front of a screen (he's still on a screen)\n\nEssentially: he found a way to monetize his hobbies and still does them for free after hours. The dream.`,
      `What does GPM do for fun? 🤔\n\nCode. He codes for fun. He is aware this is unhinged.\n\nBeyond that: learning random tech at midnight, gaming (Tekken 8, send help), ripping through manhwa chapters, and motorcycle rides when he needs a break from screens — which immediately become ideas for new side projects he codes when he gets home.\n\nThe cycle never ends. He has made peace with it.`,
      `GPM's hobby tier list 🏆\n\nS tier: Writing code that nobody asked for at 2am\nA tier: Finishing a manhwa arc at 3am on a workday\nB tier: Motorcycle ride that "clears his head" and somehow generates 3 new project ideas\nC tier: Gaming sessions that were meant to be 30 minutes\nD tier: Sleep\n\nSleep is on the list. It just isn't winning.`,
    ],
  },

  // Age / birthday
  {
    keys: ["age", "how old", "birthday", "birth", "born", "when born", "how old is he", "how old is gpm", "date of birth", "birth date", "birth year", "year born", "old is gpm"],
    reply: [
      `🎂 GPM was born on July 20, 1998 — making him 27 years old (turning 28 this July).\n\nThat means he's been writing code for roughly a third of his life and somehow still finds it fun. The diagnosis: incurable. The prognosis: more side projects.\n\nAlso a Cancer ♋ — which explains the attachment to his editor theme and the inability to delete old branches.`,
      `Born: July 20, 1998. Age: 27. 🎂\n\nHe entered the world, looked around, decided everything could use better UI, and has been shipping pixels ever since.\n\nFun fact: by his next birthday on July 20, he'll have released at least two new side projects and rewritten this portfolio once. Statistically speaking.`,
      `GPM is 27, born July 20, 1998. ♋ Cancer season. 🦀\n\nCancer traits that apply to him: deeply loyal, surprisingly emotional about clean code, will NOT let go of a project until it's perfect, and lowkey offended when someone pushes to main without a PR.\n\nCancer traits that don't apply: he does not cry. He opens an issue instead.`,
    ],
  },

  // Hometown
  {
    keys: ["hometown", "home town", "where is he from", "where he from", "where does he live", "where he lives", "location", "cebu", "philippines", "from where", "where is gpm from", "city", "origin"],
    reply: [
      `📍 Cebu City, Philippines — the Queen City of the South.\n\nYes, the same Cebu famous for lechon, beaches, and Sinulog. GPM grew up there, absorbed the culture, and then spent the rest of his life staring at monitors instead of the ocean.\n\nThe beaches are right there. He is inside. Writing code. This is fine.`,
      `Cebu City, Philippines. 🇵🇭\n\nHome of the best lechon in the world, the Sinulog festival, and apparently — GPM. The Queen City of the South has produced many great things. He is one of them. He will not be modest about this.\n\nIf you ever visit Cebu, eat the lechon. Then hire GPM. In that order.`,
      `📍 Born and raised in Cebu City, Philippines.\n\nCebu is a 7,107-island nation's second most important city, and GPM chose to represent it by becoming a full-stack engineer who ships code at 2am. The city is proud. Probably.\n\nFun fact: the timezone is PST (Philippine Standard Time, UTC+8) — so when you send that message at 9am your time, he might already be deep in a debugging session or fast asleep. Likely the former.`,
    ],
  },

  // Food preferences
  {
    keys: ["food", "favourite food", "favorite food", "eat", "what does he eat", "food preference", "diet", "spicy", "what food", "cuisine", "meal", "hungry"],
    reply: [
      `🌶️ GPM's food rule: if it's not spicy, what's even the point?\n\nThe man treats Scoville units the same way he treats code complexity — the higher the better. Mild salsa? An insult. Ghost pepper? Getting somewhere.\n\nSide note: he's lactose intolerant. So cheese is off the table. Quite literally. The spice remains non-negotiable. He will eat the spicy thing and he will be fine. Probably.`,
      `Spicy food only. No exceptions. 🌶️🔥\n\nGPM's heat tolerance is legendary. "Mild" doesn't exist in his vocabulary — that's just food that hasn't tried hard enough.\n\nAlso: lactose intolerant. No milk, no cheese, no cream. His body said no to dairy and he said fine, more spice.\n\nHydration of choice: water. Always water. The man is aggressively consistent.`,
      `Food personality type: chaotic spicy. 🌶️\n\nIf the dish isn't making him slightly sweat, he's not interested. Cebu raised him on real flavors and his palate never recovered — in the best way.\n\nDairy? Lactose intolerant. Caffeine? Just water, thanks. Spice? Unlimited. No cap.\n\nHis diet is basically: water + anything that could be considered a weapon in another context.`,
    ],
  },

  // Manga / manhwa
  {
    keys: ["manga", "manhwa", "manhua", "read", "reading", "comic", "anime", "webtoon", "what does he read", "books", "book"],
    reply: [
      `📖 GPM reads manga and manhwa — and yes, he stays up past midnight for chapter releases.\n\nHe approaches a good series the same way he approaches a good codebase: gets deeply invested, can't stop until he reaches the end, and is personally offended when it goes on hiatus.\n\nThe manhwa-to-side-project pipeline is real. Chapter inspires idea. Idea becomes repo. Repo becomes 2am commit. This is the way.`,
      `Manga and manhwa — certified reader. 📖\n\nGPM treats a new chapter drop the same way he treats a new framework release: drops everything, reads it immediately, forms strong opinions, tells no one.\n\nHe's currently juggling at least 3 ongoing series, 2 that went on hiatus and hurt him personally, and 1 he keeps "planning to start" but hasn't. Very relatable energy.`,
      `Yes, GPM reads manga and manhwa. 📚\n\nHe won't tell you which ones (shy) but the reading habits are very much there. The pattern is: find a series, binge the entire backlog in one night, go to work like a normal human, repeat.\n\nThe manhwa habit and the coding habit share the same brain region — once he starts, he doesn't stop until it's finished or it's 4am. Sometimes both.`,
    ],
  },
  // Favourite stack (highest priority — many specific keys)
  {
    keys: ["favourite stack", "favorite stack", "fav stack", "preferred stack", "best stack", "go to stack", "go-to stack", "what stack", "favourite tech", "favorite tech", "preferred tech", "favourite language", "favorite language", "tech prefer", "stack use", "stack does he use", "what does he use", "what tech does he use"],
    reply: `GPM's favourite stack 🚀\n\n🎨 Frontend — React.js · Next.js · TypeScript · Tailwind CSS · ShadCN/UI · Zustand · Framer Motion\n⚙️ Backend — Java · Spring Boot · Spring Security · REST APIs\n🗄️ Database — MySQL · SQL\n🎨 Design — Figma\n\nReact + Spring Boot is his sweet spot — clean, typed, and built to scale!`,
  },
  // Salary / rate
  {
    keys: ["salary", "rate", "pay", "how much", "compensation", "cost", "pricing", "charge", "budget"],
    reply: `GPM's rates depend on the project scope and engagement type. Best to reach out directly at ${EMAIL_ADDRESS} to discuss — he's open to finding the right arrangement! 💼`,
  },
  // Joke
  {
    keys: ["joke", "funny", "make me laugh", "tell a joke", "humor", "humour", "fun fact"],
    reply: `Why do developers prefer dark mode?\n\nBecause light attracts bugs! 🐛😄\n\n(GPM definitely writes his best code in dark mode.)`,
  },
  // AI comparison
  {
    keys: ["chatgpt", "openai", "gpt4", "gpt-4", "claude", "gemini", "llm", "ai model", "ai api", "artificial intelligence", "machine learning"],
    reply: `No external AI here! 😄 I'm ChatGPM — hand-crafted with TypeScript and pure pattern matching. No API calls, no tokens, no hallucinations (hopefully).\n\nJust GPM's knowledge, distilled into code.`,
  },
  // ── Interview questions ──────────────────────────────────────────────────────

  // Why should we hire you
  {
    keys: ["why should we hire you", "why hire you", "why hire him", "why should i hire", "why should we hire", "why should we hire gpm", "reason to hire", "why you", "why gpm"],
    reply: `Why hire GPM? 🚀\n\n✅ 7+ years of proven, full-stack experience — React, Next.js, TypeScript on the frontend; Java & Spring Boot on the backend. He doesn't just know both worlds — he ships production code in both.\n\n✅ He makes UIs feel alive — animations, micro-interactions, and pixel-perfect designs aren't afterthoughts, they're part of his standard.\n\n✅ He holds two production roles simultaneously right now — Kryterion (full-time) + Magic (part-time) — which says a lot about his reliability and output.\n\n✅ Strong Figma → code pipeline. Hand him a design and he'll hand back production-ready, responsive, accessible code.\n\n✅ He mentors, documents, and raises the bar for the whole team — not just an individual contributor.\n\nSimply put: GPM ships quality work, on time, every time. 💼`,
  },
  // Strengths and weaknesses
  {
    keys: ["strengths and weaknesses", "strength and weakness", "what are his strengths", "what are his weaknesses", "strengths weaknesses", "pros and cons", "strong points", "weak points", "strengths", "weaknesses", "what is he good at", "what is he bad at"],
    reply: `Strengths & Weaknesses 💪\n\n💪 Strengths:\n• Pixel-perfect UI implementation — he notices the 1px that everyone else misses\n• Full-stack range — seamlessly moves between React frontends and Spring Boot backends\n• Speed without sacrificing quality — ships fast, refactors clean\n• Strong communicator — can explain technical decisions to non-technical stakeholders\n• Self-driven learner — picks up new tech quickly (Nuxt, Vue, Tailwind v4 — all self-studied)\n\n⚠️ Weaknesses (areas he actively works on):\n• Can be a perfectionist — sometimes spends extra time polishing details beyond scope (he's working on time-boxing this)\n• Prefers async communication over long sync meetings — he compensates with thorough written updates\n\nHe knows his edges and works on them — that self-awareness is a strength in itself. 🧠`,
  },
  // Explain a project
  {
    keys: ["explain a project", "describe a project", "tell me about a project", "project you worked on", "project he worked on", "notable project", "best project", "biggest project", "talk about a project", "project example", "project story"],
    reply: `Let me walk you through one of GPM's standout projects 🛠\n\n📌 Sirius WebPOS — Enterprise Point-of-Sale System\n\nBuilt at Alliance Software for a large retail client.\n\n🔧 Stack: Java · Spring Boot · React · TypeScript · MySQL\n\n🎯 Challenge: The client needed a real-time POS system that handled high-volume transactions, offline fallback, and role-based access across multiple store branches.\n\n⚙️ What GPM did:\n• Designed and built the React frontend from scratch — fast, responsive, and touch-friendly for cashiers\n• Implemented Spring Boot REST APIs and Spring Security for role-based authentication\n• Built an offline-first transaction queue that synced with the server on reconnect\n• Led frontend architecture decisions and mentored two junior devs on the project\n\n📈 Result: Deployed to production across multiple branches. Zero data loss incidents post-launch.\n\nOpen the Projects app to see more! 📂`,
  },
  // Technologies most comfortable with
  {
    keys: ["most comfortable with", "comfortable with", "what technologies", "technology comfortable", "preferred technologies", "best technologies", "technologies he uses", "what tech is he comfortable", "go to technologies", "technologies most comfortable"],
    reply: `Technologies GPM is most comfortable with 🛠\n\n🥇 Frontend (his home turf):\nReact · Next.js · TypeScript · Tailwind CSS · Framer Motion · Zustand · ShadCN/UI\n\n🥇 Backend:\nJava · Spring Boot · Spring Security · MySQL · REST APIs\n\n🥈 Also very comfortable:\nFigma → React (pixel-perfect) · Three.js · GSAP · Vite · Git · Azure\n\n🥉 Familiar & can ship:\nVue.js · Nuxt.js · Laravel · PHP · Firebase · AWS\n\nHis sweet spot is React + Spring Boot — a typed, scalable, full-stack combo he's used in multiple production systems.`,
  },
  // Debugging
  {
    keys: ["bugs", "debugging", "how do you handle bugs", "handle bugs", "debug", "how does he debug", "bug fixing", "how to handle bugs", "approach to bugs", "handle a bug", "fix bugs", "bug"],
    reply: `How GPM handles bugs & debugging 🐛\n\n1️⃣ Reproduce first — never guess. He finds the minimum steps to consistently trigger the bug before touching any code.\n\n2️⃣ Isolate the layer — is it the UI, the API contract, the business logic, or the data? He narrows the blast radius fast.\n\n3️⃣ Read the error — stack traces, browser DevTools, and server logs are his first tools. He reads them fully before searching.\n\n4️⃣ Hypothesize → test → confirm — one change at a time. No shotgun fixes.\n\n5️⃣ Root cause, not band-aid — he fixes the underlying issue, not just the symptom. Then asks "where else could this happen?"\n\n6️⃣ Document — after a tricky fix, he leaves a comment or a commit message explaining *why*, not just *what*.\n\nFavorite tools: Chrome DevTools · React DevTools · Postman · IntelliJ debugger · console.log (yes, everyone does it 😄)`,
  },
  // Challenge faced
  {
    keys: ["challenge you faced", "challenge he faced", "tell me about a challenge", "difficult situation", "hard problem", "tough situation", "biggest challenge", "overcome a challenge", "hardest thing", "difficult project", "challenging project", "challenge faced"],
    reply: `A challenge GPM faced and overcame 💪\n\n📌 Challenge: Offline-first transaction system at Alliance Software\n\nThe client's stores had unreliable internet. Transactions couldn't fail just because the network dropped — cash and inventory were on the line.\n\n😤 The problem: The existing system crashed on network loss and corrupted transaction records.\n\n🔧 GPM's approach:\n• Implemented a client-side transaction queue using IndexedDB for offline persistence\n• Built a background sync mechanism that retried failed requests on reconnect\n• Added conflict resolution logic for edge cases (e.g., price updates while offline)\n• Wrote integration tests simulating offline/online switching to prevent regressions\n\n✅ Result: The system handled network drops gracefully — transactions queued offline and synced seamlessly when back online. Zero data loss post-deployment.\n\n🧠 Lesson learned: Design for failure from day one. Resilience is a feature, not an afterthought.`,
  },
  // 3–5 years
  {
    keys: ["3 to 5 years", "3-5 years", "3 5 years", "five years", "three years", "next 5 years", "next 3 years", "future plans", "where do you see", "where does he see himself", "career goals", "long term goal", "goals", "future goal", "vision", "5 years from now", "3 years from now"],
    reply: `Where GPM sees himself in 3–5 years 🔭\n\n🎯 Short-term (1–2 years):\n• Deepen expertise in distributed systems and cloud-native architecture\n• Lead a full-stack feature team — shipping product, not just code\n• Contribute to open-source projects in the React / Java ecosystem\n\n🚀 Medium-term (3–5 years):\n• Move into a Senior / Lead Engineer or Tech Lead role\n• Architect scalable systems from the ground up — not just contribute to them\n• Potentially explore building his own product or SaaS side project\n• Mentor the next generation of Philippine developers 🇵🇭\n\n💡 His north star:\nBe the engineer who bridges great engineering with great user experience — someone who can talk architecture with a CTO and pixel-perfect design with a designer in the same day.\n\nHe's not just building a career — he's building craft. 🛠`,
  },

  // ── Fun / Personal ────────────────────────────────────────────────────────

  // Favourite game
  {
    keys: ["favourite game", "favorite game", "fav game", "what game", "what games", "tekken", "plays game", "gaming", "game he plays", "what does he play"],
    reply: [
      `🎮 Tekken 8. No debate.\n\nWhile other devs are out there touching grass, GPM is in the lab perfecting combos. He picks characters the same way he picks his tech stack — with full commitment and a suspiciously high win rate.\n\nDon't challenge him. Seriously.`,
      `Tekken 8. That's the answer. That's always the answer. 🥊\n\nGPM approaches fighting games the same way he approaches coding: studies the fundamentals, learns the edge cases, and slowly becomes someone you don't want to run into online.\n\nHe has probably lab'd more combos than he's written unit tests. This is not a criticism. This is respect.`,
      `The game is Tekken 8. 🎮\n\nAsk him his main and watch his eyes light up. He will explain the matchup. You did not ask about the matchup. He will explain it anyway.\n\nHis Tekken mindset and his dev mindset are surprisingly similar: identify the pattern, find the optimal response, execute consistently. Iron Fist is basically a production environment. He is built for this.`,
    ],
  },

  // Coffee or tea
  {
    keys: ["coffee", "tea", "coffee or tea", "drink", "caffeine", "beverage", "what does he drink", "what he drink"],
    reply: [
      `☕ Neither. GPM is lactose intolerant AND caffeine-free by necessity.\n\nHis secret weapon? Water. Plain, unfiltered, boring, legendary water. 💧\n\nWhile the rest of the dev world is jittering on their 4th espresso, GPM is out here hydrated and shipping features. Hydration is his superpower. Don't knock it.`,
      `GPM does not drink coffee. GPM does not drink tea. 💧\n\nLactose intolerant (bye milk-based drinks) and apparently doesn't need caffeine to function at 2am — which is somehow more terrifying than if he did.\n\nHis drink: water. Still water. Not sparkling. Not flavored. Water water. The developer who runs on pure discipline and H₂O.`,
      `The answer is water. Just water. 💧\n\nNo coffee — lactose intolerant and apparently immune to the need for caffeine, which should be studied by scientists.\n\nWhile entire engineering teams require 3 espressos before standup, GPM rolls in powered by sleep deprivation and pure will. The water is just for hydration. The motivation is internal. Slightly concerning. Highly effective.`,
    ],
  },

  // Coding playlist
  {
    keys: ["playlist", "music", "coding music", "what he listens", "what does he listen", "listen to", "song", "songs", "coding playlist", "background music"],
    reply: [
      `🎵 GPM's coding playlist is a certified mood.\n\nWhen he's in the zone:\n• Lo-fi hip hop (obviously — it's practically a dev requirement)\n• J-pop / anime OSTs when things get intense\n• Occasional video game soundtracks because of course\n\nIf the music is too loud, the bugs can't hear him coming. That's the strategy.`,
      `Coding music selection by phase 🎵\n\n🟢 Normal feature work: lo-fi, chill beats, nothing distracting\n🟡 Complex problem: anime OST, something dramatic with violins\n🔴 Production bug at 2am: full video game final boss soundtrack\n\nThe music escalates with the urgency. Colleagues who have seen his Spotify history have concerns. He is fine. The bug got fixed.`,
      `GPM's playlist basically goes: lo-fi → J-pop → game OST → full anime final arc energy depending on how bad the codebase is. 🎵\n\nCalm lo-fi = normal day. Dramatic orchestral = something is on fire. Tekken character select music = he's given up caring and is just shipping it.\n\nYou can diagnose the severity of the bug by what's playing. This is a useful skill.`,
    ],
  },

  // Introvert or extrovert
  {
    keys: ["introvert", "extrovert", "shy", "social", "personality", "introvert or extrovert", "social anxiety", "is he shy", "is he quiet"],
    reply: [
      `🧠 Certified introvert. Social anxiety disorder and everything.\n\nIn the wild, GPM is a man of few words. In a meeting, he is also a man of few words. At a party, he is the guy near the snacks who just wants to go home and code.\n\nBUT — put him in front of a codebase? Absolute god. The keyboard is his natural habitat. He doesn't need to talk much when the code speaks for itself. 👑`,
      `Introvert. Hard introvert. 🧠\n\nSocial anxiety disorder — officially diagnosed by the vibes. In social settings he is quiet, careful, and calculating the earliest polite moment to leave.\n\nAt the keyboard? Different person entirely. Confident, decisive, opinionated about tabs vs spaces (spaces, final answer). The code is where he communicates best. His PRs have better storytelling than most people's conversations.`,
      `GPM personality type: introvert with a god complex specifically inside an IDE. 👑\n\nIn real life: man of few words, avoids unnecessary social interaction, would rather send a Slack message than walk 5 meters to talk to someone.\n\nIn code: leaves detailed comments, writes thorough PRs, mentors juniors, carries the team. Same brain. Different environment. The keyboard unlocks something.`,
    ],
  },

  // What does he do when stuck
  {
    keys: ["stuck", "when stuck", "what does he do when stuck", "debugging strategy", "problem solving", "how does he solve", "what does he do", "when he gets stuck", "approach to problems"],
    reply: [
      `😤 GPM's "I'm stuck" protocol:\n\n1. Stare at the screen for 5 more minutes (mandatory)\n2. Set a new goal — use the pressure of a deadline to kick the brain into gear\n3. Pressure is the point. No urgency = no breakthrough\n\nHe doesn't wait for motivation. He manufactures it. Nothing debugs faster than the feeling of being slightly behind schedule. Fear is a feature, not a bug. 💀`,
      `When GPM is stuck, he sets a new goal. 🎯\n\nNot to fix the bug. Not to unblock himself. A new goal — one that creates pressure, urgency, a reason to push through.\n\nHe doesn't believe in waiting for inspiration. He manufactures the conditions for it. Mild panic is his most productive state. This is not advice. This is a confession. It works.`,
      `GPM's stuck routine: 😤\n\n• 5 more minutes of staring (this is mandatory and non-negotiable)\n• Create artificial pressure — set a goal, make a bet with himself, invent a deadline\n• Let the pressure do the work\n\nHe has found that comfort = stagnation and discomfort = breakthroughs. So he voluntarily makes things uncomfortable until his brain has no choice but to solve the problem. Unhinged. Effective. 10/10 would recommend (with caution).`,
    ],
  },

  // Guilty pleasure tech
  {
    keys: ["guilty pleasure", "guilty pleasure tech", "outside coding", "non coding", "what else", "other than coding", "motorcycle", "side project", "side projects", "personal project"],
    reply: [
      `🏍️ GPM's guilty pleasures, in no particular order:\n\n1. Motorcycle rides — full send, no hesitation\n2. Gaming sessions that were "just 30 minutes"\n3. Starting new side projects at 11pm like it's a great idea\n\nThe side projects especially. He has more unfinished personal projects than browser tabs. Every one of them started with "this'll only take a weekend." None of them took only a weekend. 💀`,
      `Guilty pleasures, ranked by how often they derail his sleep schedule 🏍️\n\n🥇 New side project at 11pm — it's always a great idea at 11pm. It is never a great idea at 11pm.\n🥈 Motorcycle ride that turns into 3 hours and 2 new project ideas\n🥉 "One more game" in Tekken 8 — said at least 7 times per session\n\nHe regrets none of it. This is the problem. He will never stop.`,
      `GPM's guilty pleasures are very on brand. 🏍️\n\nMotorcycle rides to "clear his head" — which really means stew on a new feature idea for 45 minutes at 80km/h. Dangerous for bugs. Dangerous in general.\n\nThen he gets home, opens his laptop, and starts the repo. At 11pm. On a Wednesday. The side project graveyard grows. He visits it lovingly. One day he'll ship one. Today is not that day.`,
    ],
  },

  // What would he build
  {
    keys: ["build if money", "money wasn't a concern", "money was no object", "unlimited budget", "dream project", "what would he build", "if he could build", "dream build", "build anything"],
    reply: [
      `💸 If money was no concern?\n\nGPM would build the ultimate bug resolver — an AI that reads your codebase, understands your intention, finds every bug, fixes it, writes the tests, and opens the PR.\n\nBasically himself, but faster and without the social anxiety. A clone, essentially. A GPM instance that doesn't need water breaks. 🤖\n\nHe'd call it ChatGPM Pro. It would be terrifying. He would ship it anyway.`,
      `Dream project with unlimited budget? 🤔💸\n\nAn AI that resolves bugs before you even know they exist. Reads your intent, not just your code. Predicts failure modes. Writes the fix, the test, the docs, and the commit message.\n\nEssentially: GPM, but running 24/7 without the motorcycle breaks and the Tekken sessions. A distilled, caffeinated (on water) version of himself. He'd name it something humble. Like GPM Pro Max Ultra. Or just let it name itself. That's either brilliant or a disaster. He'd ship it regardless.`,
      `Money no object? 💸\n\nHe'd build the tool that ends debugging as a profession. Not a helper — a resolver. Something that takes the bug, understands the context of the entire system, and eliminates it completely.\n\nWhy? Because GPM has spent a significant portion of his 27 years on this planet staring at error messages. He'd like a refund on that time. The tool is the refund. Failing that, he'd build this portfolio but bigger. Much bigger. Unnecessarily bigger.`,
    ],
  },

  // Night owl or early bird
  {
    keys: ["night owl", "early bird", "morning person", "night person", "sleep", "what time", "when does he work", "when does he code", "work at night", "work in the morning"],
    reply: [
      `🦉 Night owl. Deeply, unrepentantly, a night owl.\n\nGPM's best code is written when normal humans are unconscious. The hours between midnight and 3am hit different — no meetings, no notifications, just GPM and the terminal.\n\nHis commits at 2am are statistically better than his commits at 9am. This is not a theory. This is peer-reviewed data from a sample size of one.`,
      `Night owl, no contest. 🌙\n\nThe 9am version of GPM is functional. Hydrated. Present. Fine.\n\nThe 1am version of GPM is in a flow state so deep that time stops being real, the terminal output becomes readable in his native language, and he has accidentally solved 3 problems he didn't know existed.\n\nMorning is a social construct. Midnight is when the real work happens.`,
      `🦉 He has seen more sunrises from the wrong side than the right side.\n\nGPM's peak hours: 11pm–3am. No distractions, no meetings, just the hum of the fan and the glow of the monitor.\n\nHe would be a menace if he ever fixed his sleep schedule. The software industry is quietly relieved that he hasn't.`,
    ],
  },

  // Thanks
  {
    keys: ["thank", "thanks", "thank you", "ty", "thx", "appreciate", "appreciated", "cheers", "nice", "great", "awesome", "cool", "helpful"],
    reply: [
      "You're welcome! 😊 Anything else you'd like to know about GPM?",
      "Happy to help! Feel free to keep asking.",
      "Glad I could help! Ask me anything else about GPM.",
    ],
  },
  // Goodbye
  {
    keys: ["bye", "goodbye", "see ya", "see you", "later", "ciao", "take care", "farewell", "ttyl", "gotta go"],
    reply: `Goodbye! 👋 Explore the projects, and reach out to GPM if you're interested in working together. He'd love to hear from you!`,
  },
];

// ── Suggestions ───────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  "Who is GPM?",
  "What are his skills?",
  "What are his strengths?",
  "Why should we hire GPM?",
  "What services does he offer?",
  "What are his certifications?",
  "Favourite stack?",
  "Greatest achievements?",
  "How does he handle bugs?",
  "Tell me about a challenge he faced",
  "Affiliated companies?",
  "Key contributions?",
  "Where does he see himself in 5 years?",
  "How to contact?",
  "What is ChatGPM?",
  "What projects has he built?",
  "Favourite game?",
  "Coffee or tea?",
  "What's his coding playlist?",
  "Introvert or extrovert?",
  "What does he do when stuck?",
  "Night owl or early bird?",
  "What would he build with unlimited budget?",
  "What are his guilty pleasures?",
  "How old is GPM?",
  "Where is he from?",
  "What's his favourite food?",
  "Does he read manga?",
  "What are his hobbies?",
];

// Groups of 4 shown at a time, cycling automatically
const SUGGESTION_PAGE_SIZE = 4;

// Placeholder lines that cycle in the input field
const PLACEHOLDER_CYCLE = [
  "Ask anything about GPM…",
  "Why should we hire GPM?",
  "What technologies is he comfortable with?",
  "Tell me about a challenge he faced…",
  "What services does he offer?",
  "Where does he see himself in 5 years?",
  "What are his strengths and weaknesses?",
  "How does he handle debugging?",
  "What certifications does he have?",
  "What is ChatGPM?",
];

// ── Component ─────────────────────────────────────────────────────────────────

export function ChatContent() {
  useLocaleRefresh();
  const language = useLanguageStore((s) => s.language);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Hey! 👋 I'm ChatGPM — your AI guide to Gene Paul Mar Javier's portfolio.\n\nAsk me anything about his skills, experience, projects, or how to hire him!",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  // Typewriter state — id of message currently being revealed + how many chars shown
  const [typewriterId, setTypewriterId] = useState<string | null>("welcome");
  const [typewriterLen, setTypewriterLen] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const botTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // True while bot is thinking OR while typewriter is still animating
  const isBusy = typing || !!typewriterId;

  // Cycling suggestion page
  const totalPages = Math.ceil(SUGGESTIONS.length / SUGGESTION_PAGE_SIZE);
  const [suggPage, setSuggPage] = useState(0);
  const [suggDir, setSuggDir] = useState(1); // 1 = forward, -1 = backward

  // Cycling placeholder
  const [phIdx, setPhIdx] = useState(0);
  const [phVisible, setPhVisible] = useState(true);

  // Auto-advance suggestion page every 4 s
  useEffect(() => {
    const id = setInterval(() => {
      setSuggDir(1);
      setSuggPage((p) => (p + 1) % totalPages);
    }, 4000);
    return () => clearInterval(id);
  }, [totalPages]);

  // Fade-cycle placeholder every 3 s (only when input is empty)
  useEffect(() => {
    if (input) return;
    const id = setInterval(() => {
      setPhVisible(false);
      setTimeout(() => {
        setPhIdx((i) => (i + 1) % PLACEHOLDER_CYCLE.length);
        setPhVisible(true);
      }, 350);
    }, 3000);
    return () => clearInterval(id);
  }, [input]);

  // Scroll on new messages, typing state, or typewriter progress
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, typewriterLen]);

  // Typewriter ticker
  useEffect(() => {
    if (!typewriterId) return;
    const msg = messages.find((m) => m.id === typewriterId);
    if (!msg) return;
    if (typewriterLen >= msg.text.length) { setTypewriterId(null); return; }
    const id = setTimeout(() => setTypewriterLen((n) => n + 1), 12);
    return () => clearTimeout(id);
  }, [typewriterId, typewriterLen, messages]);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;

    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, role: "user", text: trimmed },
    ]);
    setInput("");
    setTyping(true);

    const delay = 700 + Math.min(trimmed.length * 8, 800);
    botTimeoutRef.current = setTimeout(() => {
      botTimeoutRef.current = null;
      setTyping(false);
      const botId = `b-${Date.now()}`;
      setMessages((m) => [
        ...m,
        { id: botId, role: "bot", text: matchKB(trimmed) },
      ]);
      setTypewriterId(botId);
      setTypewriterLen(0);
    }, delay);
  }, [isBusy]);

  const handleStop = useCallback(() => {
    // Cancel pending bot response (thinking phase)
    if (botTimeoutRef.current) {
      clearTimeout(botTimeoutRef.current);
      botTimeoutRef.current = null;
      setTyping(false);
    }
    // Freeze typewriter exactly where it is — truncate the message to current length
    if (typewriterId) {
      setMessages((msgs) =>
        msgs.map((m) =>
          m.id === typewriterId
            ? { ...m, text: m.text.slice(0, typewriterLen) }
            : m
        )
      );
      setTypewriterId(null);
    }
  }, [typewriterId, typewriterLen]);

  const showSuggestions = messages.length === 1 && !typing;
  const currentSuggs = SUGGESTIONS.slice(
    suggPage * SUGGESTION_PAGE_SIZE,
    suggPage * SUGGESTION_PAGE_SIZE + SUGGESTION_PAGE_SIZE,
  );

  return (
    <div
      className="font-mac flex flex-col flex-1 min-h-0 overflow-hidden"
      style={{ background: "var(--a26-window)" }}
    >
      {/* Header */}
      <div className="shrink-0 flex items-center gap-2.5 px-4 py-2.5 border-b border-a26-glass-border bg-a26-title-bar">
        <div
          className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)" }}
        >
          <Sparkles size={13} color="white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-a26-text text-[13px] font-semibold leading-none mb-0.5">ChatGPM</div>
          <div className="text-a26-muted text-[10px]">AI · GPM Knowledge Base</div>
        </div>
        <span
          className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
          style={{
            background: "color-mix(in srgb, #A855F7 14%, transparent)",
            color: "#C084FC",
            border: "1px solid color-mix(in srgb, #A855F7 28%, transparent)",
          }}
        >
          2026 AI
        </span>
      </div>

      {/* English-only warning */}
      {language !== "en" && (
        <div
          className="shrink-0 flex items-center gap-2 px-4 py-2 text-[11px]"
          style={{
            background: "color-mix(in srgb, #F59E0B 12%, transparent)",
            borderBottom: "1px solid color-mix(in srgb, #F59E0B 30%, transparent)",
            color: "#FCD34D",
          }}
        >
          <TriangleAlert size={12} className="shrink-0" />
          {translate("win26.englishOnly")}
        </div>
      )}

      {/* Messages */}
      <div
        className="win26-scroll flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-2 [scrollbar-width:thin]"
        style={{ scrollbarColor: "rgba(255,255,255,0.12) transparent" }}
      >
        {messages.map((msg) => {
          const isAnimating = msg.id === typewriterId;
          const displayText = isAnimating ? msg.text.slice(0, typewriterLen) : msg.text;
          return (
            <div
              key={msg.id}
              className={`flex mb-3 ${msg.role === "user" ? "justify-end" : "items-start"}`}
            >
              {msg.role === "bot" && (
                <div
                  className="w-6 h-6 rounded-[7px] flex items-center justify-center shrink-0 mr-2 mt-0.5"
                  style={{ background: "linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)" }}
                >
                  <Sparkles size={10} color="white" />
                </div>
              )}
              <div
                className={`max-w-[78%] px-3 py-2 text-[12.5px] leading-[1.68] whitespace-pre-wrap wrap-break-word ${
                  msg.role === "user" ? "rounded-[14px] rounded-tr-lg" : "rounded-[14px] rounded-tl-lg"
                }`}
                style={
                  msg.role === "user"
                    ? { background: "var(--a26-teal)", color: "#fff" }
                    : {
                        background: "var(--a26-glass)",
                        border: "1px solid var(--a26-glass-border)",
                        color: "var(--a26-text)",
                      }
                }
              >
                {displayText}
                {isAnimating && typewriterLen < msg.text.length && (
                  <span
                    className="inline-block w-0.5 h-3.25 ml-px align-middle rounded-sm"
                    style={{
                      background: "#A855F7",
                      animation: "blink 0.7s step-end infinite",
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typing && (
          <div className="flex items-start mb-3">
            <div
              className="w-6 h-6 rounded-[7px] flex items-center justify-center shrink-0 mr-2"
              style={{ background: "linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)" }}
            >
              <Sparkles size={10} color="white" />
            </div>
            <div
              className="px-3 py-2.5 rounded-[14px] rounded-tl-lg flex items-center gap-1"
              style={{ background: "var(--a26-glass)", border: "1px solid var(--a26-glass-border)" }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--a26-text-muted)" }}
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                  transition={{ duration: 1.0, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quick suggestions — shown only after welcome message */}
        {showSuggestions && (
          <div className="mt-1 mb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-a26-muted text-[10px] font-semibold uppercase tracking-[0.08em]">
                Quick questions
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setSuggDir(i > suggPage ? 1 : -1); setSuggPage(i); }}
                    className="border-none cursor-pointer p-0 transition-all duration-200"
                    style={{
                      width: i === suggPage ? 14 : 5,
                      height: 5,
                      borderRadius: 3,
                      background: i === suggPage ? "#A855F7" : "rgba(255,255,255,0.18)",
                    }}
                  />
                ))}
              </div>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={suggPage}
                initial={{ opacity: 0, x: suggDir * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: suggDir * -24 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex flex-wrap gap-1.5"
              >
                {currentSuggs.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="font-mac text-[11px] px-2.5 py-1 rounded-full cursor-pointer transition-all duration-120"
                    style={{
                      background: "var(--a26-glass)",
                      border: "1px solid var(--a26-glass-border)",
                      color: "var(--a26-text-mid)",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 flex items-center gap-2 px-3.5 py-3 border-t border-a26-glass-border">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
            }}
            placeholder=""
            spellCheck={false}
            autoFocus
            disabled={isBusy}
            className="w-full text-a26-text text-[12.5px] rounded-[20px] px-3.5 py-2 outline-none font-mac transition-colors duration-120"
            style={{
              background: "var(--a26-glass)",
              border: `1px solid ${isBusy ? "color-mix(in srgb, #A855F7 30%, transparent)" : "var(--a26-glass-border)"}`,
              caretColor: "#A855F7",
              opacity: isBusy ? 0.6 : 1,
            }}
          />
          {/* Animated placeholder overlay */}
          {!input && (
            <div className="pointer-events-none absolute inset-0 flex items-center px-3.5 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                {isBusy ? (
                  <motion.span
                    key="busy"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="text-[12.5px] truncate"
                    style={{ color: "#A855F7" }}
                  >
                    ChatGPM is typing…
                  </motion.span>
                ) : (
                  <motion.span
                    key={phIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: phVisible ? 1 : 0, y: phVisible ? 0 : -6 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="text-[12.5px] truncate"
                    style={{ color: "var(--a26-text-muted)" }}
                  >
                    {PLACEHOLDER_CYCLE[phIdx]}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Stop button while busy, send button otherwise */}
        {isBusy ? (
          <button
            onClick={handleStop}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-none cursor-pointer transition-all duration-120"
            style={{
              background: "color-mix(in srgb, #A855F7 18%, transparent)",
              color: "#C084FC",
              border: "1px solid color-mix(in srgb, #A855F7 35%, transparent)",
            }}
            aria-label="Stop"
          >
            <Square size={11} fill="#C084FC" />
          </button>
        ) : (
          <button
            onClick={() => send(input)}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-none transition-all duration-120 cursor-pointer"
            style={{
              background: input.trim()
                ? "linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)"
                : "var(--a26-glass)",
              color: input.trim() ? "white" : "var(--a26-text-muted)",
              opacity: !input.trim() ? 0.6 : 1,
            }}
            aria-label="Send message"
          >
            <Send size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
