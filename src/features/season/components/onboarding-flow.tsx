"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { DateStep } from "@/features/season/components/date-step";
import { FocusStep } from "@/features/season/components/focus-step";
import { ReviewStep } from "@/features/season/components/review-step";
import { WelcomeStep } from "@/features/season/components/welcome-step";
import { WhyStep } from "@/features/season/components/why-step";
import { cn } from "@/lib/utils";

const STEPS = ["welcome", "focus", "why", "date", "review"] as const;

type Step = (typeof STEPS)[number];

export function OnboardingFlow() {
  const t = useTranslations("onboarding");
  const [step, setStep] = useState<Step>("welcome");
  const reducedMotion = useReducedMotion();

  const goBack = () => {
    const previous = STEPS[STEPS.indexOf(step) - 1];
    if (previous) setStep(previous);
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pb-8">
      <header className="flex h-14 shrink-0 items-center">
        <button
          type="button"
          onClick={goBack}
          aria-label={t("back")}
          className={cn(
            "text-muted-foreground hover:text-foreground -ml-2 rounded-full p-2 transition-colors",
            step === "welcome" && "pointer-events-none opacity-0",
          )}
        >
          <ChevronLeft className="size-5" />
        </button>
      </header>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: reducedMotion ? 0 : 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: reducedMotion ? 0 : -28 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="flex flex-1 flex-col"
        >
          {step === "welcome" ? (
            <WelcomeStep onNext={() => setStep("focus")} />
          ) : null}
          {step === "focus" ? (
            <FocusStep onNext={() => setStep("why")} />
          ) : null}
          {step === "why" ? <WhyStep onNext={() => setStep("date")} /> : null}
          {step === "date" ? (
            <DateStep onNext={() => setStep("review")} />
          ) : null}
          {step === "review" ? <ReviewStep onBack={goBack} /> : null}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
