"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { slideStep } from "@/design/tokens";
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
    <main className="max-w-app mx-auto flex min-h-dvh w-full flex-col px-6 pb-8">
      {/*
        A quiet top bar rather than an app bar: no title, no step counter, no
        progress. All five steps are one continuous thought, so the only
        chrome is the way back. Sized to the documented 64px top bar, with a
        44px touch target for the control inside it.
      */}
      <header className="flex h-[var(--size-topbar-height)] shrink-0 items-center">
        <button
          type="button"
          onClick={goBack}
          aria-label={t("back")}
          className={cn(
            "text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-pill -ml-2 flex size-[var(--size-touch-target-min)] items-center justify-center transition-colors outline-none focus-visible:ring-3",
            step === "welcome" && "pointer-events-none opacity-0",
          )}
        >
          <ChevronLeft className="size-5" />
        </button>
      </header>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          {...slideStep(Boolean(reducedMotion))}
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
