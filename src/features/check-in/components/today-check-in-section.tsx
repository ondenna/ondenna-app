"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { CheckInForm } from "@/features/check-in/components/check-in-form";
import { CompletedCheckIn } from "@/features/check-in/components/completed-check-in";
import { isYesterdayInSeason } from "@/features/check-in/editability";
import { DISPLAY_DATE_TIME_ZONE, addDays, isoDateToUtcDate } from "@/lib/dates";
import { useCheckInStore } from "@/stores/check-ins";

/**
 * Everything the "active" season state shows on Today: today's check-in
 * (form or calm confirmation), and — quietly, beneath it — yesterday, when
 * it is still inside the season. Mounted only while todayState is "active"
 * (see TodayDashboard); upcoming and complete never reach this component.
 */
export function TodayCheckInSection({
  startDate,
  today,
}: {
  startDate: string;
  today: string;
}) {
  const t = useTranslations("dashboard.checkIn");
  const format = useFormatter();
  const checkIns = useCheckInStore((s) => s.checkIns);

  const yesterday = addDays(today, -1);
  const todayCheckIn = checkIns[today];
  const yesterdayCheckIn = checkIns[yesterday];
  const yesterdayAvailable = isYesterdayInSeason(startDate, today);

  const [target, setTarget] = useState<"today" | "yesterday">("today");
  const [editing, setEditing] = useState(false);

  const activeDate = target === "today" ? today : yesterday;
  const activeCheckIn = target === "today" ? todayCheckIn : yesterdayCheckIn;
  const showForm = editing || !activeCheckIn;
  const showCancel = target === "yesterday" || Boolean(todayCheckIn && editing);

  const completedHeadingRef = useRef<HTMLHeadingElement>(null);
  const [saveCount, setSaveCount] = useState(0);

  // Focus the confirmation deliberately after a save, never on first render
  // or when simply switching between today and yesterday.
  useEffect(() => {
    if (saveCount > 0) completedHeadingRef.current?.focus();
  }, [saveCount]);

  const returnToToday = () => {
    setTarget("today");
    setEditing(false);
  };

  // Yesterday is a constrained secondary flow (docs/screens.md 4: "a brief,
  // quiet acknowledgment ... then back to Today"): saving it returns to
  // Today's own state rather than lingering on a second confirmation screen.
  const handleSaved = () => {
    setEditing(false);
    setSaveCount((count) => count + 1);
    if (target === "yesterday") setTarget("today");
  };

  const longDate = (iso: string) =>
    format.dateTime(isoDateToUtcDate(iso), {
      dateStyle: "long",
      timeZone: DISPLAY_DATE_TIME_ZONE,
    });

  return (
    <div>
      {target === "yesterday" ? (
        <p className="text-muted-foreground text-small">
          {t("yesterdayContext", { date: longDate(yesterday) })}
        </p>
      ) : null}

      {showForm ? (
        <CheckInForm
          // Keyed on the date: without this, switching from today's form to
          // yesterday's (or back) reuses the same component instance, and
          // react-hook-form only reads `existing` into its defaultValues on
          // mount — so the form would keep showing whichever record it saw
          // first instead of the one it's actually now editing.
          key={activeDate}
          date={activeDate}
          question={target === "today" ? t("question") : t("yesterdayQuestion")}
          existing={activeCheckIn}
          onSaved={handleSaved}
          onCancel={showCancel ? returnToToday : undefined}
        />
      ) : (
        <CompletedCheckIn
          ref={completedHeadingRef}
          checkIn={activeCheckIn}
          title={
            target === "today"
              ? t("recordedTitle")
              : t("recordedYesterdayTitle")
          }
          onEdit={() => setEditing(true)}
        />
      )}

      {yesterdayAvailable && target === "today" ? (
        <div className="border-divider mt-8 border-t pt-6">
          <button
            type="button"
            onClick={() => {
              setTarget("yesterday");
              setEditing(true);
            }}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-small flex min-h-[var(--size-touch-target-min)] items-center rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-3"
          >
            {yesterdayCheckIn ? t("editYesterday") : t("addYesterday")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
