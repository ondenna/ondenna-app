"use client";

import { useTranslations } from "next-intl";

import { OndennaMark } from "@/components/logo";
import { Button } from "@/components/ui/button";

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations("welcome");

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <OndennaMark className="text-muted-foreground size-10" />
        <div className="space-y-3">
          <h1 className="text-3xl font-medium tracking-tight text-balance">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-balance">{t("subtitle")}</p>
        </div>
      </div>
      <Button size="lg" className="w-full" onClick={onNext}>
        {t("cta")}
      </Button>
    </div>
  );
}
