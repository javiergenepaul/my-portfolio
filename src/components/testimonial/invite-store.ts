/**
 * SIMULATED testimonial-invite store (localStorage).
 *
 * Prototype only: the admin creates a per-recipient invite (token), shares the
 * link, and the recipient can submit exactly once while the invite is "active".
 * localStorage lets the full flow work within one browser. The real version is
 * a Supabase `testimonial_invites` row keyed by token (works across devices),
 * with the submit gated by RLS + status.
 */

import type { SocialLink } from "./social-platforms";

export type InviteStatus = "active" | "submitted" | "revoked";

export interface SubmittedTestimonial {
  name: string;
  role?: string;
  company?: string;
  relationship?: string;
  rating: number;
  message: string;
  photo?: string | null;
  socials?: SocialLink[];
  submittedAt: string;
}

export interface TestimonialInvite {
  token: string;
  recipientName: string;
  recipientRole?: string;
  recipientCompany?: string;
  status: InviteStatus;
  createdAt: string;
  testimonial?: SubmittedTestimonial;
}

const KEY = "testimonial-invites";

function readAll(): TestimonialInvite[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function writeAll(list: TestimonialInvite[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

function newToken(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  }
  return Math.random().toString(36).slice(2, 14);
}

export function listInvites(): TestimonialInvite[] {
  return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getInvite(token: string): TestimonialInvite | undefined {
  return readAll().find((i) => i.token === token);
}

export function createInvite(input: {
  recipientName: string;
  recipientRole?: string;
  recipientCompany?: string;
}): TestimonialInvite {
  const invite: TestimonialInvite = {
    token: newToken(),
    recipientName: input.recipientName.trim(),
    recipientRole: input.recipientRole?.trim() || undefined,
    recipientCompany: input.recipientCompany?.trim() || undefined,
    status: "active",
    createdAt: new Date().toISOString(),
  };
  writeAll([invite, ...readAll()]);
  return invite;
}

export function submitInvite(
  token: string,
  data: Omit<SubmittedTestimonial, "submittedAt">,
): boolean {
  const list = readAll();
  const i = list.findIndex((x) => x.token === token);
  if (i === -1 || list[i].status !== "active") return false;
  list[i] = {
    ...list[i],
    status: "submitted",
    testimonial: { ...data, submittedAt: new Date().toISOString() },
  };
  writeAll(list);
  return true;
}

export function revokeInvite(token: string) {
  const list = readAll();
  const i = list.findIndex((x) => x.token === token);
  if (i === -1) return;
  list[i] = { ...list[i], status: "revoked" };
  writeAll(list);
}

export function reactivateInvite(token: string) {
  const list = readAll();
  const i = list.findIndex((x) => x.token === token);
  if (i === -1 || list[i].status === "submitted") return;
  list[i] = { ...list[i], status: "active" };
  writeAll(list);
}

export function deleteInvite(token: string) {
  writeAll(readAll().filter((x) => x.token !== token));
}

/** Seed a couple of example invites the first time the admin opens Requests. */
export function seedInvitesIfEmpty() {
  if (typeof window === "undefined") return;
  if (readAll().length > 0) return;
  const now = Date.now();
  const seed: TestimonialInvite[] = [
    {
      token: "demoactive001",
      recipientName: "Maria Santos",
      recipientRole: "Engineering Manager",
      recipientCompany: "Alliance Software Inc.",
      status: "active",
      createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      token: "demosubmit002",
      recipientName: "John Reyes",
      recipientRole: "Product Lead",
      recipientCompany: "Magic",
      status: "submitted",
      createdAt: new Date(now - 1000 * 60 * 60 * 72).toISOString(),
      testimonial: {
        name: "John Reyes",
        role: "Product Lead",
        company: "Magic",
        relationship: "Manager",
        rating: 5,
        message:
          "Gene is reliable, fast, and genuinely thoughtful about performance. He owned features end to end and made the whole team better.",
        photo: null,
        socials: [
          { platform: "linkedin", url: "https://linkedin.com/in/johnreyes" },
          { platform: "github", url: "https://github.com/johnreyes" },
        ],
        submittedAt: new Date(now - 1000 * 60 * 60 * 60).toISOString(),
      },
    },
  ];
  writeAll(seed);
}
