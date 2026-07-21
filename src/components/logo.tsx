import { SEASON_LENGTH_DAYS } from "@/lib/dates";
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

const RING_CENTER = 64;
// Held close to the mark on purpose. Pushed further out the ticks stopped
// reading as one mark and started to look like rays around a distant dot.
const TICK_INNER_RADIUS = 38;
const TICK_OUTER_RADIUS = 46;

/**
 * The season ring: one hairline for each day of a season, drawn around the
 * mark. The count comes from SEASON_LENGTH_DAYS, so the geometry is the
 * product rather than an ornament that happens to look circular.
 *
 * Every tick is identical, deliberately. The moment one differs it becomes a
 * progress meter, and Ondenna does not measure progress.
 */
export function SeasonRing({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      aria-hidden="true"
      className={cn("size-32", className)}
    >
      {Array.from({ length: SEASON_LENGTH_DAYS }, (_, day) => {
        const angle = (day / SEASON_LENGTH_DAYS) * 2 * Math.PI - Math.PI / 2;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        return (
          <line
            key={day}
            x1={(RING_CENTER + TICK_INNER_RADIUS * cos).toFixed(2)}
            y1={(RING_CENTER + TICK_INNER_RADIUS * sin).toFixed(2)}
            x2={(RING_CENTER + TICK_OUTER_RADIUS * cos).toFixed(2)}
            y2={(RING_CENTER + TICK_OUTER_RADIUS * sin).toFixed(2)}
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
