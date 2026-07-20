"use client";

import { useFormatter, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DISPLAY_DATE_TIME_ZONE,
  isoDateToUtcDate,
  isoDateToday,
  seasonEndDate,
} from "@/lib/dates";
import { useSeasonDraftStore } from "@/stores/season-draft";

export function DateStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations("onboarding");
  const format = useFormatter();
  const startDate = useSeasonDraftStore((s) => s.draft.startDate);
  const setStartDate = useSeasonDraftStore((s) => s.setStartDate);

  const today = isoDateToday();
  const endDate = isoDateToUtcDate(seasonEndDate(startDate));

  return (
    <div className="flex flex-1 flex-col">
      <div className="pt-8">
        <h1 className="text-3xl font-medium tracking-tight text-balance">
          {t("date.question")}
        </h1>
        <label
          htmlFor="season-start-date"
          className="text-muted-foreground mt-8 block text-sm"
        >
          {t("date.label")}
        </label>
        <Input
          id="season-start-date"
          type="date"
          value={startDate}
          min={today}
          onChange={(event) => setStartDate(event.target.value || today)}
          className="mt-2 h-12 text-base"
        />
        <p className="text-muted-foreground mt-4 text-sm">
          {t("date.endsOn", {
            date: format.dateTime(endDate, {
              dateStyle: "long",
              timeZone: DISPLAY_DATE_TIME_ZONE,
            }),
          })}
        </p>
      </div>
      <Button size="lg" className="mt-auto w-full" onClick={onNext}>
        {t("continue")}
      </Button>
    </div>
  );
}
