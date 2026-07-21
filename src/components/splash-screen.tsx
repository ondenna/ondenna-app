"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { OndennaMark } from "@/components/logo";
import { SPLASH_FADE_MS, SPLASH_HOLD_MS, fadeIn } from "@/design/tokens";
import { useRouter } from "@/i18n/navigation";
import { useSeasonDraftStore } from "@/stores/season-draft";

export function SplashScreen() {
  const t = useTranslations("app");
  const router = useRouter();
  const hasStarted = useSeasonDraftStore((s) => s.hasStarted);
  const reducedMotion = useReducedMotion();

  // The splash is decorative. Someone who has asked for reduced motion is
  // routed on immediately rather than held through a pause they did not ask
  // for — the hold is the animation here, so skipping one means skipping
  // both.
  const holdMs = reducedMotion ? 0 : SPLASH_HOLD_MS;

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(hasStarted ? "/today" : "/onboarding");
    }, holdMs);
    return () => clearTimeout(timer);
  }, [router, hasStarted, holdMs]);

  return (
    <main className="bg-background flex min-h-dvh items-center justify-center">
      <motion.div
        {...fadeIn(Boolean(reducedMotion), SPLASH_FADE_MS)}
        className="flex flex-col items-center gap-4"
      >
        {/* Same mark, same size, same colour as the Welcome screen, so the
            handover from splash to onboarding reads as one moment. */}
        <OndennaMark className="text-foreground size-12" />
        <h1 className="text-h3 tracking-wordmark uppercase">{t("name")}</h1>
      </motion.div>
    </main>
  );
}
