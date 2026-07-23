"use client";

import { useState } from "react";
import {
  Star,
  ImagePlus,
  Check,
  CircleCheck,
  Send,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { useProfile } from "@/lib/content/use-content";
import { cn } from "@/lib/utils";
import {
  SOCIAL_PLATFORMS,
  getPlatform,
  type SocialLink,
} from "./social-platforms";

const RELATIONSHIPS = ["Colleague", "Client", "Manager", "Mentor", "Peer"];

export interface TestimonialSubmission {
  name: string;
  role: string;
  company: string;
  relationship: string;
  rating: number;
  message: string;
  photo: string | null;
  socials: SocialLink[];
}

export function TestimonialSubmissionForm({
  defaults,
  onSubmitted,
}: {
  defaults?: { name?: string; role?: string; company?: string };
  /** Return false to signal the submission was rejected (used/revoked link). */
  onSubmitted?: (
    data: TestimonialSubmission,
  ) => void | boolean | Promise<boolean | void>;
} = {}) {
  const profile = useProfile();
  const [name, setName] = useState(defaults?.name ?? "");
  const [role, setRole] = useState(defaults?.role ?? "");
  const [company, setCompany] = useState(defaults?.company ?? "");
  const [relationship, setRelationship] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  // At least one social link is required, so start with one empty row visible.
  const [socials, setSocials] = useState<SocialLink[]>([
    { platform: "linkedin", url: "" },
  ]);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSocial = () =>
    setSocials((s) => [...s, { platform: "linkedin", url: "" }]);
  const updateSocial = (i: number, patch: Partial<SocialLink>) =>
    setSocials((s) => s.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const removeSocial = (i: number) =>
    setSocials((s) => s.filter((_, idx) => idx !== i));

  const validSocials = socials.filter((s) => s.url.trim().length > 0);
  const canSubmit =
    name.trim().length > 0 &&
    message.trim().length > 0 &&
    validSocials.length >= 1 &&
    consent;

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || busy) return;
    setBusy(true);
    setError(null);
    try {
      // A handler returning false means the write was rejected (already used
      // or revoked link) — keep the form up rather than faking success.
      const ok = await onSubmitted?.({
        name: name.trim(),
        role: role.trim(),
        company: company.trim(),
        relationship,
        rating,
        message: message.trim(),
        photo,
        socials: socials.filter((s) => s.url.trim().length > 0),
      });
      if (ok === false) {
        setError(
          "This link has already been used or is no longer active. Ask for a fresh one.",
        );
        return;
      }
      setSubmitted(true);
    } catch {
      setError(
        "Something went wrong sending your testimonial. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <Shell>
        <div className="flex flex-col items-center text-center py-6">
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-emerald-500/15 text-emerald-500 mb-5">
            <CircleCheck size={30} />
          </div>
          <h1 className="text-xl font-semibold">Thank you, {name.trim()}!</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Your testimonial has been submitted.{" "}
            {profile.fullName.split(" ")[0]} will review it before it appears on
            the portfolio.
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Testimonial
        </p>
        <h1 className="text-xl font-semibold mt-1">
          Share your experience working with {profile.fullName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Your words help others understand what it&apos;s like to work with me.
          It only takes a minute.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {/* Rating */}
        <div className="flex flex-col gap-2">
          <Label>Overall, how was it working together?</Label>
          <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                className="p-0.5"
              >
                <Star
                  size={26}
                  className={cn(
                    "transition-colors",
                    n <= (hover || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30",
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Identity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Your name" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
            />
          </Field>
          <Field label="Relationship">
            <Select value={relationship} onValueChange={setRelationship}>
              <SelectTrigger>
                <SelectValue placeholder="How do you know me?" />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIPS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Role / title">
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Engineering Manager"
            />
          </Field>
          <Field label="Company">
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Inc."
            />
          </Field>
        </div>

        {/* Social links */}
        <div className="flex flex-col gap-2">
          <Label>
            Social links
            <span className="text-destructive ml-0.5">*</span>
          </Label>
          <p className="-mt-0.5 text-xs text-muted-foreground">
            Add at least one profile so people know it&apos;s really you.
          </p>
          {socials.length > 0 && (
            <div className="flex flex-col gap-2">
              {socials.map((s, i) => {
                const plat = getPlatform(s.platform);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <Select
                      value={s.platform}
                      onValueChange={(v) => updateSocial(i, { platform: v })}
                    >
                      <SelectTrigger className="w-36 shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SOCIAL_PLATFORMS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            <span className="flex items-center gap-2">
                              <p.icon size={14} /> {p.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="url"
                      value={s.url}
                      onChange={(e) => updateSocial(i, { url: e.target.value })}
                      placeholder={plat?.placeholder ?? "https://…"}
                    />
                    {socials.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeSocial(i)}
                        aria-label="Remove link"
                      >
                        <X size={15} />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit gap-1.5"
            onClick={addSocial}
          >
            <Plus size={14} /> Add social link
          </Button>
        </div>

        {/* Message */}
        <Field label="Your testimonial" required>
          <Textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What was it like working with me? What stood out?"
          />
        </Field>

        {/* Photo */}
        <div className="flex flex-col gap-2">
          <Label>Photo (optional)</Label>
          {photo ? (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt="Preview"
                className="h-14 w-14 rounded-full object-cover border border-border"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPhoto(null)}
              >
                Remove
              </Button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 hover:border-primary/40 transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPhoto}
              />
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-background border border-border text-muted-foreground">
                <ImagePlus size={18} />
              </div>
              <span className="text-sm text-muted-foreground">
                Add a photo of yourself
              </span>
            </label>
          )}
        </div>

        {/* Consent */}
        <button
          type="button"
          onClick={() => setConsent((c) => !c)}
          className="flex items-start gap-2.5 text-left"
        >
          <span
            className={cn(
              "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors",
              consent
                ? "bg-primary border-primary text-primary-foreground"
                : "border-input bg-background",
            )}
          >
            {consent && <Check size={11} strokeWidth={3} />}
          </span>
          <span className="text-sm text-muted-foreground leading-relaxed">
            I give permission to publish this testimonial — including my name
            {photo ? ", photo," : ""} and role — publicly on {profile.fullName}
            &apos;s portfolio.
          </span>
        </button>

        <Button
          type="submit"
          disabled={!canSubmit || busy}
          className="gap-2 mt-1"
        >
          {busy ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Send size={15} />
          )}
          {busy ? "Sending…" : "Submit testimonial"}
        </Button>
        {error && <p className="text-[12px] text-destructive -mt-2">{error}</p>}
        {!canSubmit && (
          <p className="text-[11px] text-muted-foreground -mt-2">
            {!name.trim() || !message.trim()
              ? "Fill in your name and testimonial to submit."
              : validSocials.length < 1
                ? "Add at least one social link to submit."
                : "The permission checkbox is required to submit."}
          </p>
        )}
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh w-full flex items-start sm:items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm my-6">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}
