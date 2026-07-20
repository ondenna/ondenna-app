"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { OndennaMark } from "@/components/logo";
import { useRouter } from "@/i18n/navigation";
import { useSeasonDraftStore } from "@/stores/season-draft";

const SPLASH_DURATION_MS = 2000;

export function SplashScreen() {
  const t = useTranslations("app");
  const router = useRouter();
  const hasStarted = useSeasonDraftStore((s) => s.hasStarted);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(hasStarted ? "/today" : "/onboarding");
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [router, hasStarted]);

  return (
    <main className="bg-background flex min-h-dvh items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: reducedMotion ? 0 : 1.1,
          ease: "easeOut",
        }}
        className="flex flex-col items-center gap-5"
      >
        <OndennaMark className="text-foreground" />
        <h1 className="text-xl font-medium tracking-[0.3em] uppercase">
          {t("name")}
        </h1>
      </motion.div>
    </main>
  );
}
