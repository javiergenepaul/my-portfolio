import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-8xl font-bold text-primary">404</h1>
      <p className="text-2xl font-semibold">Page Not Found</p>
      <p className="max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/2027"
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Back to Portfolio
      </Link>
    </div>
  );
}
