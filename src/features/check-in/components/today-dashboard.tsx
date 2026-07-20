"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import {
  SEASON_LENGTH_DAYS,
  isoDateToDate,
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
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pt-16 pb-8">
      <p className="text-muted-foreground text-sm">
        {startsInFuture
          ? t("startsOn", {
              date: format.dateTime(isoDateToDate(draft.startDate), {
                dateStyle: "long",
              }),
            })
          : t("day", { day: displayDay, length: SEASON_LENGTH_DAYS })}
      </p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight text-balance">
        {draft.focus}
      </h1>

      <section className="border-border bg-card mt-12 rounded-2xl border p-5">
        <h2 className="text-sm font-medium">{t("commitmentTitle")}</h2>
        <p className="text-muted-foreground mt-1.5 text-sm">
          {t("commitmentPlaceholder")}
        </p>
      </section>

      <div className="mt-auto">
        <Button size="lg" className="w-full" disabled>
          {t("checkIn")}
        </Button>
        <p className="text-muted-foreground mt-3 text-center text-xs">
          {t("checkInHint")}
        </p>
      </div>
    </main>
  );
}
