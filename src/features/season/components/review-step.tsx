"use client";

import { useFormatter, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import {
  DISPLAY_DATE_TIME_ZONE,
  isoDateToUtcDate,
  seasonEndDate,
} from "@/lib/dates";
import { useSeasonDraftStore } from "@/stores/season-draft";

/**
 * Final screen of season creation (docs/screens.md 2d). A season cannot be
 * edited once it starts, so the commitment is made here — deliberately, and
 * only after the whole draft has been read back to the user.
 */
export function ReviewStep({ onBack }: { onBack: () => void }) {
  const t = useTranslations("onboarding.review");
  const format = useFormatter();
  const router = useRouter();
  const draft = useSeasonDraftStore((s) => s.draft);
  const startSeason = useSeasonDraftStore((s) => s.startSeason);

  const longDate = (iso: string) =>
    format.dateTime(isoDateToUtcDate(iso), {
      dateStyle: "long",
      timeZone: DISPLAY_DATE_TIME_ZONE,
    });

  const handleBegin = () => {
    startSeason();
    router.replace("/today");
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="pt-8">
        <h1 className="text-h1 text-balance">{t("question")}</h1>

        {/*
          The draft read back as an intention, not an admin summary. Grouping
          comes from whitespace and one hairline rule — the intention above,
          its timing below — rather than from cards or a settings table. The
          focus is set in the serif at heading scale because it is the thing
          being committed to; everything else stays quiet around it.
        */}
        <dl className="mt-10 space-y-8">
          <div>
            <dt className="text-muted-foreground text-small">
              {t("focusLabel")}
            </dt>
            <dd className="font-heading text-h2 mt-2 text-balance">
              {draft.focus}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-small">
              {t("whyLabel")}
            </dt>
            <dd className="text-body mt-2 whitespace-pre-line">{draft.why}</dd>
          </div>
          <div className="border-divider flex gap-10 border-t pt-8">
            <div>
              <dt className="text-muted-foreground text-small">
                {t("startLabel")}
              </dt>
              <dd className="text-body mt-2">{longDate(draft.startDate)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-small">
                {t("endLabel")}
              </dt>
              <dd className="text-body mt-2">
                {longDate(seasonEndDate(draft.startDate))}
              </dd>
            </div>
          </div>
        </dl>

        <p className="text-muted-foreground text-small mt-8">
          {t("lengthNotice")}
        </p>
      </div>

      {/*
        The commitment zone. The lock notice keeps full-strength text colour —
        it is the one thing the user must understand before committing — but
        it is stated plainly, never in a warning colour.
      */}
      <div className="mt-auto pt-10">
        <p id="season-lock-notice" className="text-small">
          {t("lockNotice")}
        </p>
        <Button
          size="lg"
          className="mt-4 w-full"
          aria-describedby="season-lock-notice"
          onClick={handleBegin}
        >
          {t("cta")}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="text-muted-foreground mt-2 w-full"
          onClick={onBack}
        >
          {t("edit")}
        </Button>
      </div>
    </div>
  );
}
