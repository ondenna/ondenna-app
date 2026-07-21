"use client";

import { useTranslations } from "next-intl";

import { OndennaMark, SeasonRing } from "@/components/logo";
import { Button } from "@/components/ui/button";

/**
 * The first screen anyone sees (docs/screens.md 1). Its job is emotional
 * orientation, not explanation: the mark, one editorial statement, one quiet
 * supporting thought, one action. No feature tour, no second CTA.
 */
export function WelcomeStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations("welcome");

  return (
    <div className="flex flex-1 flex-col">
      {/*
        The flow's top bar is empty on this screen — there is nowhere to go
        back to — so centring inside the space below it left the composition
        sitting a full bar's height low, with a visible void above the mark.
        Cancelling that height centres the group on the screen itself.
      */}
      <div className="-mt-[var(--size-topbar-height)] flex flex-1 flex-col items-center justify-center text-center">
        {/*
          The mark held inside the season ring: one intention, and the
          twenty-eight days around it. This is the only decorative element in
          onboarding and it lives only here, on the screen whose whole purpose
          is identity. The mark is unchanged and matches the splash exactly,
          so arriving from the splash feels continuous.
        */}
        <div className="relative flex size-32 shrink-0 items-center justify-center">
          <SeasonRing className="text-border absolute inset-0 size-full" />
          <OndennaMark className="text-foreground size-12" />
        </div>

        <h1 className="text-display mt-10 text-balance">{t("title")}</h1>
        <p className="text-muted-foreground text-body mt-4 text-balance">
          {t("subtitle")}
        </p>
      </div>

      <Button size="lg" className="w-full" onClick={onNext}>
        {t("cta")}
      </Button>
    </div>
  );
}
