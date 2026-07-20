import { cn } from "@/lib/utils";

/** The Ondenna mark: a quiet, open circle — a season. */
export function OndennaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={cn("size-12", className)}
    >
      <circle
        cx="24"
        cy="24"
        r="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}
