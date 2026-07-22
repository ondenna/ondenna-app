import { useTranslations } from "next-intl";
import { forwardRef } from "react";

import { Button } from "@/components/ui/button";
import type { CheckIn } from "@/stores/check-ins";

interface CompletedCheckInProps {
  checkIn: CheckIn;
  /** "Today is recorded." vs "Yesterday is recorded." */
  title: string;
  onEdit: () => void;
}

/**
 * The calm confirmation state (docs/screens.md 3: "a calm confirmation; the
 * app encourages the user to leave and live their day"). No icon, no colour
 * change between yes and no — both are equally valid records of the day.
 */
export const CompletedCheckIn = forwardRef<
  HTMLHeadingElement,
  CompletedCheckInProps
>(function CompletedCheckIn({ checkIn, title, onEdit }, ref) {
  const t = useTranslations("dashboard.checkIn");

  return (
    <div>
      <h2
        ref={ref}
        tabIndex={-1}
        className="text-body font-sans font-medium outline-none"
      >
        {title}
      </h2>
      <p className="text-muted-foreground text-body mt-2">
        {t(checkIn.answer === "yes" ? "recordedYes" : "recordedNo")}
      </p>
      {checkIn.note ? (
        <p className="text-body mt-4 whitespace-pre-line">{checkIn.note}</p>
      ) : null}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-muted-foreground mt-4 -ml-2"
        onClick={onEdit}
      >
        {t("edit")}
      </Button>
    </div>
  );
});
