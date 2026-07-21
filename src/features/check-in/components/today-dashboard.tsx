"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import {
  DISPLAY_DATE_TIME_ZONE,
  SEASON_LENGTH_DAYS,
  isoDateToUtcDate,
  isoDateToday,
  seasonDayNumber,
} from "@/lib/dates";
import { useSeasonDraftStore } from "@/stores/season-draft";

export function TodayDashboard() {
  const t = useTranslations("dashboard");
  const format = useFormatter();
  const router = useRouter();
  const draft = useSeasonDraftStore((s) => s.draft);
  const hasStarted = useSeasonDraftStore((s) => s.hasStarted);

  // Sprint 1 keeps the season in memory only, so a direct visit (or a
  // reload) without a season quietly returns to onboarding.
  useEffect(() => {
    if (!hasStarted) router.replace("/onboarding");
  }, [hasStarted, router]);

  if (!hasStarted) return null;

  const day = seasonDayNumber(draft.startDate, isoDateToday());
  const startsInFuture = day < 1;
  const displayDay = Math.min(Math.max(day, 1), SEASON_LENGTH_DAYS);

  return (
    <main className="max-w-app mx-auto flex min-h-dvh w-full flex-col px-6 pt-16 pb-8">
      <p className="text-muted-foreground text-small">
        {startsInFuture
          ? t("startsOn", {
              date: format.dateTime(isoDateToUtcDate(draft.startDate), {
                dateStyle: "long",
                timeZone: DISPLAY_DATE_TIME_ZONE,
              }),
            })
          : t("day", { day: displayDay, length: SEASON_LENGTH_DAYS })}
      </p>
      <h1 className="text-h1 mt-2 text-balance">{draft.focus}</h1>

      <section className="border-border bg-surface shadow-subtle mt-12 rounded-md border p-6">
        <h2 className="text-small font-sans font-medium">
          {t("commitmentTitle")}
        </h2>
        <p className="text-muted-foreground text-small mt-2">
          {t("commitmentPlaceholder")}
        </p>
      </section>

      <div className="mt-auto">
        <Button size="lg" className="w-full" disabled>
          {t("checkIn")}
        </Button>
        <p className="text-muted-foreground text-caption mt-2 text-center">
          {t("checkInHint")}
        </p>
      </div>
    </main>
  );
}
