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
        <h1 className="text-h1 text-balance">{t("date.question")}</h1>
        {/*
          The native date picker is the best mobile experience here, so only
          the composition around it changes. The end date is stated as one
          quiet sentence rather than a second field or a duration readout —
          this is choosing the start of a chapter, not configuring software.
        */}
        <label
          htmlFor="season-start-date"
          className="text-muted-foreground text-small mt-8 block"
        >
          {t("date.label")}
        </label>
        <Input
          id="season-start-date"
          type="date"
          value={startDate}
          min={today}
          onChange={(event) => setStartDate(event.target.value || today)}
          className="mt-2"
        />
        <p className="text-muted-foreground text-small mt-4">
          {t("date.endsOn", {
            date: format.dateTime(endDate, {
              dateStyle: "long",
              timeZone: DISPLAY_DATE_TIME_ZONE,
            }),
          })}
        </p>
      </div>

      <div className="mt-auto pt-8">
        <Button size="lg" className="w-full" onClick={onNext}>
          {t("continue")}
        </Button>
      </div>
    </div>
  );
}
