"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { FULL_NAME, JOB_TITLE, EMAIL_ADDRESS } from "@/config/data/personal";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
}

// ── Knowledge base engine ─────────────────────────────────────────────────────

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/**
 * Token-based scoring matcher.
 * Each KB entry has a list of keyword strings (single words or short phrases).
 * The input is normalised → tokenised into words + bigrams.
 * Phrases (multi-word keys) count for 2 points; single words count for 1.
 * The entry with the highest score wins; ties go to the first entry (priority order).
 */
type KBEntry = { keys: string[]; reply: string | string[] };

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
  let bestEntry: KBEntry | null = null;
  let bestScore = 0;
  for (const entry of KB) {
    let score = 0;
    for (const key of entry.keys) {
      if (key.includes(" ")) {
        if (norm.includes(key)) score += 2;
      } else {
        if (tokens.has(key)) score += 1;
      }
    }
    if (score > bestScore) { bestScore = score; bestEntry = entry; }
  }
  if (!bestEntry) return pick(FALLBACKS);
  const r = bestEntry.reply;
  return typeof r === "string" ? r : pick(r);
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
    keys: ["who are you", "what are you", "your purpose", "what can you do", "how do you work", "chatgpm", "chat gpm", "are you ai", "are you bot"],
    reply: `I'm ChatGPM — a built-in AI assistant for ${FULL_NAME}'s portfolio 🤖\n\nNo external API. I know everything about GPM: skills, work history, projects, education, and contact info. Just ask!`,
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
    reply: `Outside of coding, GPM enjoys:\n\n🎮 Gaming — the origin of his love for interactive UX!\n🎨 UI/UX design exploration\n✈️ Travel & discovering new places\n🌐 Experimenting with bleeding-edge web tech\n\nHis gamer mindset is why his UIs always feel alive.`,
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
  "First job?",
  "Greatest achievements?",
  "Affiliated companies?",
  "Key contributions?",
  "Favourite stack?",
  "How to contact?",
];

// ── Component ─────────────────────────────────────────────────────────────────

export function ChatContent() {
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
    if (!trimmed || typing) return;

    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, role: "user", text: trimmed },
    ]);
    setInput("");
    setTyping(true);

    const delay = 700 + Math.min(trimmed.length * 8, 800);
    setTimeout(() => {
      setTyping(false);
      const botId = `b-${Date.now()}`;
      setMessages((m) => [
        ...m,
        { id: botId, role: "bot", text: matchKB(trimmed) },
      ]);
      setTypewriterId(botId);
      setTypewriterLen(0);
    }, delay);
  }, [typing]);

  const showSuggestions = messages.length === 1 && !typing;

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
            <div className="text-a26-muted text-[10px] font-semibold uppercase tracking-[0.08em] mb-2">
              Quick questions
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
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
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 flex items-center gap-2 px-3.5 py-3 border-t border-a26-glass-border">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
          }}
          placeholder="Ask anything about GPM…"
          spellCheck={false}
          autoFocus
          disabled={typing}
          className="flex-1 text-a26-text text-[12.5px] rounded-[20px] px-3.5 py-2 outline-none font-mac placeholder:text-a26-muted transition-colors duration-120"
          style={{
            background: "var(--a26-glass)",
            border: "1px solid var(--a26-glass-border)",
            caretColor: "#A855F7",
          }}
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || typing}
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-none transition-all duration-120 cursor-pointer"
          style={{
            background: input.trim() && !typing
              ? "linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)"
              : "var(--a26-glass)",
            color: input.trim() && !typing ? "white" : "var(--a26-text-muted)",
            opacity: !input.trim() || typing ? 0.6 : 1,
          }}
          aria-label="Send message"
        >
          <Send size={13} />
        </button>
      </div>
    </div>
  );
}
