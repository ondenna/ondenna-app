"use client";

import { useFormatter, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";
import { isoDateToDate, isoDateToday, seasonEndDate } from "@/lib/dates";
import { useSeasonDraftStore } from "@/stores/season-draft";

export function DateStep() {
  const t = useTranslations("onboarding.date");
  const format = useFormatter();
  const router = useRouter();
  const startDate = useSeasonDraftStore((s) => s.draft.startDate);
  const setStartDate = useSeasonDraftStore((s) => s.setStartDate);
  const startSeason = useSeasonDraftStore((s) => s.startSeason);

  const today = isoDateToday();
  const endDate = isoDateToDate(seasonEndDate(startDate));

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
        <label
          htmlFor="season-start-date"
          className="text-muted-foreground mt-8 block text-sm"
        >
          {t("label")}
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
          {t("endsOn", {
            date: format.dateTime(endDate, { dateStyle: "long" }),
          })}
        </p>
      </div>
      <Button size="lg" className="mt-auto w-full" onClick={handleBegin}>
        {t("cta")}
      </Button>
    </div>
  );
}
