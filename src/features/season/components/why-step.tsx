"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  whySchema,
  type WhyValues,
} from "@/features/season/schemas/onboarding";
import { useSeasonDraftStore } from "@/stores/season-draft";

export function WhyStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations("onboarding");
  const why = useSeasonDraftStore((s) => s.draft.why);
  const setWhy = useSeasonDraftStore((s) => s.setWhy);

  const form = useForm<WhyValues>({
    resolver: zodResolver(whySchema),
    defaultValues: { why },
  });

  // See focus-step: keep unsubmitted text in the draft across back-navigation.
  useEffect(
    () => () => {
      setWhy(form.getValues("why").trim());
    },
    [form, setWhy],
  );

  const onSubmit = form.handleSubmit((values) => {
    setWhy(values.why.trim());
    onNext();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
      <div className="pt-8">
        <h1 className="text-3xl font-medium tracking-tight text-balance">
          {t("why.question")}
        </h1>
        <Textarea
          autoFocus
          rows={5}
          placeholder={t("why.placeholder")}
          aria-invalid={Boolean(form.formState.errors.why)}
          className="mt-8 min-h-32 resize-none text-base"
          {...form.register("why")}
        />
        {form.formState.errors.why ? (
          <p className="text-destructive mt-2 text-sm">{t("why.error")}</p>
        ) : null}
      </div>
      <Button type="submit" size="lg" className="mt-auto w-full">
        {t("continue")}
      </Button>
    </form>
  );
}
