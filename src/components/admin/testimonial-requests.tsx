"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Copy,
  Trash2,
  Eye,
  Ban,
  RotateCcw,
  Star,
  Send,
  CircleCheck,
  Globe,
} from "lucide-react";
import { getPlatform } from "@/components/testimonial/social-platforms";
import {
  Button,
  Input,
  Label,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  useToast,
} from "@/components";
import { cn } from "@/lib/utils";
import {
  listInvites,
  createInvite,
  revokeInvite,
  reactivateInvite,
  deleteInvite,
  seedInvitesIfEmpty,
  type TestimonialInvite,
} from "@/components/testimonial/invite-store";

export function TestimonialRequests() {
  const { toast } = useToast();
  const [invites, setInvites] = useState<TestimonialInvite[]>([]);
  const refresh = () => setInvites(listInvites());

  useEffect(() => {
    seedInvitesIfEmpty();
    refresh();
  }, []);

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [generated, setGenerated] = useState<TestimonialInvite | null>(null);

  // View-submission dialog
  const [viewing, setViewing] = useState<TestimonialInvite | null>(null);
  // Delete confirm
  const [deleting, setDeleting] = useState<TestimonialInvite | null>(null);

  const linkFor = (token: string) =>
    typeof window !== "undefined"
      ? `${window.location.origin}/testimonial/${token}`
      : `/testimonial/${token}`;

  const copyLink = async (token: string) => {
    try {
      await navigator.clipboard.writeText(linkFor(token));
      toast({ title: "Link copied", duration: 2500 });
    } catch {
      toast({
        variant: "destructive",
        title: "Couldn't copy",
        description: linkFor(token),
      });
    }
  };

  const resetCreate = () => {
    setName("");
    setRole("");
    setCompany("");
    setGenerated(null);
  };

  const onGenerate = () => {
    if (!name.trim()) return;
    const inv = createInvite({
      recipientName: name,
      recipientRole: role,
      recipientCompany: company,
    });
    refresh();
    setGenerated(inv);
  };

  const onRevoke = (token: string) => {
    revokeInvite(token);
    refresh();
    toast({ title: "Link deactivated", duration: 2500 });
  };
  const onReactivate = (token: string) => {
    reactivateInvite(token);
    refresh();
    toast({ title: "Link reactivated", duration: 2500 });
  };
  const onDelete = () => {
    if (!deleting) return;
    deleteInvite(deleting.token);
    refresh();
    setDeleting(null);
    toast({ variant: "destructive", title: "Request deleted", duration: 2500 });
  };
  const onApprove = () => {
    toast({
      title: "Approved (simulated)",
      description:
        "This would publish the testimonial to your Testimonials list.",
      duration: 3500,
    });
    setViewing(null);
  };

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2.5">
            <Send size={22} className="text-primary" />
            Testimonial requests
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create a personal link for someone, send it to them, and their
            submission shows up here for review.
          </p>
        </div>
        <Button
          onClick={() => {
            resetCreate();
            setCreateOpen(true);
          }}
          className="gap-1.5 shrink-0"
        >
          <Plus size={16} /> New request
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Recipient</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="hidden sm:table-cell w-32">
                Created
              </TableHead>
              <TableHead className="w-56 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.map((inv) => (
              <TableRow key={inv.token}>
                <TableCell>
                  <div className="font-medium">{inv.recipientName}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {[inv.recipientRole, inv.recipientCompany]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={inv.status} />
                </TableCell>
                <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                  {new Date(inv.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-0.5">
                    {inv.status === "submitted" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 h-8"
                        onClick={() => setViewing(inv)}
                      >
                        <Eye size={14} /> View
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Copy link"
                        onClick={() => copyLink(inv.token)}
                      >
                        <Copy size={14} />
                      </Button>
                    )}
                    {inv.status === "active" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-amber-500"
                        title="Deactivate link"
                        onClick={() => onRevoke(inv.token)}
                      >
                        <Ban size={14} />
                      </Button>
                    )}
                    {inv.status === "revoked" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        title="Reactivate link"
                        onClick={() => onReactivate(inv.token)}
                      >
                        <RotateCcw size={14} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      title="Delete"
                      onClick={() => setDeleting(inv)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {invites.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-sm text-muted-foreground py-10"
                >
                  No requests yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create / generate dialog */}
      <Dialog
        open={createOpen}
        onOpenChange={(o) => {
          setCreateOpen(o);
          if (!o) resetCreate();
        }}
      >
        <DialogContent className="max-w-md">
          {generated ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CircleCheck size={18} className="text-emerald-500" />
                  Link ready for {generated.recipientName}
                </DialogTitle>
                <DialogDescription>
                  Send this personal link. They can submit once, while it stays
                  active.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={linkFor(generated.token)}
                  className="text-xs"
                />
                <Button
                  variant="outline"
                  className="gap-1.5 shrink-0"
                  onClick={() => copyLink(generated.token)}
                >
                  <Copy size={14} /> Copy
                </Button>
              </div>
              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="outline" onClick={resetCreate}>
                  Create another
                </Button>
                <Button onClick={() => setCreateOpen(false)}>Done</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>New testimonial request</DialogTitle>
                <DialogDescription>
                  Who are you asking? We&apos;ll generate a private link to send
                  them.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="r-name">
                    Recipient name
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    id="r-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Maria Santos"
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="r-role">Role (optional)</Label>
                    <Input
                      id="r-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Manager"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="r-company">Company (optional)</Label>
                    <Input
                      id="r-company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Inc."
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={onGenerate}
                  disabled={!name.trim()}
                  className="gap-1.5"
                >
                  <Send size={15} /> Generate link
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* View submission dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-md">
          {viewing?.testimonial && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.testimonial.name}</DialogTitle>
                <DialogDescription>
                  {[viewing.testimonial.role, viewing.testimonial.company]
                    .filter(Boolean)
                    .join(" · ")}
                  {viewing.testimonial.relationship
                    ? ` — ${viewing.testimonial.relationship}`
                    : ""}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={16}
                      className={cn(
                        n <= viewing.testimonial!.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30",
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  “{viewing.testimonial.message}”
                </p>
                {viewing.testimonial.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={viewing.testimonial.photo}
                    alt={viewing.testimonial.name}
                    className="h-14 w-14 rounded-full object-cover border border-border"
                  />
                )}
                {viewing.testimonial.socials &&
                  viewing.testimonial.socials.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {viewing.testimonial.socials.map((s, i) => {
                        const plat = getPlatform(s.platform);
                        const Icon = plat?.icon ?? Globe;
                        return (
                          <a
                            key={i}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                          >
                            <Icon size={13} /> {plat?.label ?? "Link"}
                          </a>
                        );
                      })}
                    </div>
                  )}
              </div>
              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="outline" onClick={() => setViewing(null)}>
                  Close
                </Button>
                <Button onClick={onApprove} className="gap-1.5">
                  <CircleCheck size={15} /> Approve &amp; publish
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete request?</DialogTitle>
            <DialogDescription>
              {deleting
                ? `The request for "${deleting.recipientName}" and its link will be removed. This cannot be undone.`
                : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: TestimonialInvite["status"] }) {
  if (status === "submitted")
    return (
      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15 border-transparent">
        Submitted
      </Badge>
    );
  if (status === "revoked") return <Badge variant="secondary">Revoked</Badge>;
  return (
    <Badge className="bg-primary/15 text-primary hover:bg-primary/15 border-transparent">
      Active
    </Badge>
  );
}
