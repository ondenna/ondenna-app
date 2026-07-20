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
        <h1 className="text-3xl font-medium tracking-tight text-balance">
          {t("question")}
        </h1>

        <dl className="mt-8 space-y-6">
          <div>
            <dt className="text-muted-foreground text-sm">{t("focusLabel")}</dt>
            <dd className="mt-1 text-lg font-medium tracking-tight text-balance">
              {draft.focus}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">{t("whyLabel")}</dt>
            <dd className="mt-1 text-base leading-relaxed whitespace-pre-line">
              {draft.why}
            </dd>
          </div>
          <div className="flex gap-10">
            <div>
              <dt className="text-muted-foreground text-sm">
                {t("startLabel")}
              </dt>
              <dd className="mt-1 text-base">{longDate(draft.startDate)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">{t("endLabel")}</dt>
              <dd className="mt-1 text-base">
                {longDate(seasonEndDate(draft.startDate))}
              </dd>
            </div>
          </div>
        </dl>

        <p className="text-muted-foreground mt-6 text-sm">{t("lengthNotice")}</p>
      </div>

      <div className="mt-auto pt-10">
        <p id="season-lock-notice" className="text-sm leading-relaxed">
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
