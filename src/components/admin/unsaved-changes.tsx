"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components";

/**
 * Unsaved-changes guard for the admin.
 *
 * The managers (ContentManager / ResumeManager) edit into a working draft and
 * only commit on Save, so leaving the page mid-edit silently drops everything.
 * This intercepts both exits:
 *
 *   - tab close / reload → native `beforeunload` prompt
 *   - in-app navigation  → `GuardedLink`, which defers the route change and
 *     asks first
 *
 * The App Router has no navigation-blocking API (no `router.events`, and
 * `useBlocker` is React Router only), so a link click can't be intercepted
 * after the fact — the guard has to live on the links themselves. That's why
 * every admin nav link goes through `GuardedLink` rather than `next/link`.
 *
 * Dirty state is held in a ref, not state: the guard is only ever read at click
 * time, and keeping it out of the render path means a keystroke in the editor
 * doesn't re-render the whole shell.
 */

interface UnsavedChangesValue {
  /** Registers one source's dirty state, keyed so sources can't clobber each other. */
  setDirty: (id: string, dirty: boolean) => void;
  /**
   * Runs `navigate` immediately when clean and returns true. When dirty, defers
   * it behind the confirm dialog and returns false so the caller can cancel the
   * default action.
   */
  requestNavigation: (navigate: () => void) => boolean;
}

const UnsavedChangesContext = createContext<UnsavedChangesValue | null>(null);

export function UnsavedChangesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Keyed by source, not a single flag: a manager and an open edit drawer can
  // both be dirty at once, and the drawer unmounting must not clear the
  // manager's state. The page is dirty while any source is.
  const dirtySourcesRef = useRef(new Set<string>());
  const [pending, setPending] = useState<(() => void) | null>(null);

  const setDirty = useCallback((id: string, dirty: boolean) => {
    if (dirty) dirtySourcesRef.current.add(id);
    else dirtySourcesRef.current.delete(id);
  }, []);

  const requestNavigation = useCallback((navigate: () => void) => {
    if (dirtySourcesRef.current.size === 0) return true;
    // The updater form would call `navigate`; return it instead to store it.
    setPending(() => navigate);
    return false;
  }, []);

  const discard = () => {
    const navigate = pending;
    setPending(null);
    // The flag is deliberately left alone: the manager clears it on unmount.
    // Clearing it here would leave a stale-clean window if the navigation
    // doesn't unmount anything (e.g. a link to the current route), letting the
    // next exit slip through unprompted.
    navigate?.();
  };

  return (
    <UnsavedChangesContext.Provider value={{ setDirty, requestNavigation }}>
      {children}
      <Dialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Discard unsaved changes?</DialogTitle>
            <DialogDescription>
              Your edits haven&apos;t been saved yet. Leaving this page will
              lose them.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setPending(null)}>
              Keep editing
            </Button>
            <Button variant="destructive" onClick={discard}>
              Discard and leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UnsavedChangesContext.Provider>
  );
}

function useUnsavedChanges(): UnsavedChangesValue {
  const ctx = useContext(UnsavedChangesContext);
  if (!ctx)
    throw new Error(
      "useUnsavedChanges must be used within <UnsavedChangesProvider>",
    );
  return ctx;
}

/**
 * Publishes a manager's dirty flag to the guard and arms the browser's own
 * close/reload prompt while it's set.
 */
export function useUnsavedChangesGuard(dirty: boolean) {
  const { setDirty } = useUnsavedChanges();
  const id = useId();

  useEffect(() => {
    setDirty(id, dirty);
    // Unmounting the source (e.g. after a route change, or closing the drawer)
    // clears its entry, so a stale `true` can't block navigation later.
    return () => setDirty(id, false);
  }, [dirty, id, setDirty]);

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Legacy browsers require returnValue to be set to show the prompt.
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);
}

/**
 * Runs `action` (sign-out, etc.) once any unsaved edits are resolved.
 *
 * Unlike `GuardedLink` — where a clean state means "let the <Link> navigate
 * itself" — an action has no default behaviour to fall through to, so this
 * invokes it directly. `requestNavigation` only runs the callback when it has
 * to defer behind the dialog.
 */
export function useGuardedAction() {
  const { requestNavigation } = useUnsavedChanges();
  return useCallback(
    (action: () => void) => {
      if (requestNavigation(action)) action();
    },
    [requestNavigation],
  );
}

/**
 * Drop-in `next/link` that routes through the guard. Modified clicks (new tab,
 * new window, middle click) are left alone — they don't unload this page.
 */
export function GuardedLink({
  href,
  children,
  onClick,
  ...props
}: React.ComponentProps<typeof Link> & { href: string }) {
  const router = useRouter();
  const { requestNavigation } = useUnsavedChanges();

  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (
          e.defaultPrevented ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0
        ) {
          return;
        }
        if (!requestNavigation(() => router.push(href))) e.preventDefault();
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
