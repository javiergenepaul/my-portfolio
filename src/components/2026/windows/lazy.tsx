"use client";

import dynamic from "next/dynamic";

/**
 * Code-split window contents, shared by both the desktop shell (AppWindow)
 * and the MobilePortfolio. Each chunk is only fetched when its window/app is
 * first opened, keeping the initial /2026 bundle small on low-end devices.
 */
export const WinLoading = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="w-5 h-5 rounded-full border-2 border-a26-glass-border border-t-transparent animate-spin" />
  </div>
);

export const AboutContent = dynamic(
  () => import("./about-content").then((m) => m.AboutContent),
  { ssr: false, loading: WinLoading },
);
export const BooksContent = dynamic(
  () => import("./books-content").then((m) => m.BooksContent),
  { ssr: false, loading: WinLoading },
);
export const TestimonialsContent = dynamic(
  () => import("./testimonials-content").then((m) => m.TestimonialsContent),
  { ssr: false, loading: WinLoading },
);
export const ProjectsContent = dynamic(
  () => import("./projects-content").then((m) => m.ProjectsContent),
  { ssr: false, loading: WinLoading },
);
export const ItunesContent = dynamic(
  () => import("./itunes-content").then((m) => m.ItunesContent),
  { ssr: false, loading: WinLoading },
);
export const TerminalContent = dynamic(
  () => import("./terminal-content").then((m) => m.TerminalContent),
  { ssr: false, loading: WinLoading },
);
export const SkillsContent = dynamic(
  () => import("./skills-content").then((m) => m.SkillsContent),
  { ssr: false, loading: WinLoading },
);
export const ContactContent = dynamic(
  () => import("./contact-content").then((m) => m.ContactContent),
  { ssr: false, loading: WinLoading },
);
export const ResumeContent = dynamic(
  () => import("./resume-content").then((m) => m.ResumeContent),
  { ssr: false, loading: WinLoading },
);
export const SettingsContent = dynamic(
  () => import("./settings-content").then((m) => m.SettingsContent),
  { ssr: false, loading: WinLoading },
);
export const ChatContent = dynamic(
  () => import("./chat-content").then((m) => m.ChatContent),
  { ssr: false, loading: WinLoading },
);
export const GamesContent = dynamic(
  () => import("./games-content").then((m) => m.GamesContent),
  { ssr: false, loading: WinLoading },
);
export const SnakeContent = dynamic(
  () => import("./snake-content").then((m) => m.SnakeContent),
  { ssr: false, loading: WinLoading },
);
export const HanoiContent = dynamic(
  () => import("./hanoi-content").then((m) => m.HanoiContent),
  { ssr: false, loading: WinLoading },
);
export const TetrisContent = dynamic(
  () => import("./tetris-content").then((m) => m.TetrisContent),
  { ssr: false, loading: WinLoading },
);
export const JumpContent = dynamic(
  () => import("./jump-content").then((m) => m.JumpContent),
  { ssr: false, loading: WinLoading },
);
export const BomberContent = dynamic(
  () => import("./bomber-content").then((m) => m.BomberContent),
  { ssr: false, loading: WinLoading },
);
