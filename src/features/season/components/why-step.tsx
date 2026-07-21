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
      <div className="flex flex-1 flex-col pt-8">
        <h1 className="text-h1 shrink-0 text-balance">{t("why.question")}</h1>
        {/*
          A writing space, not a form control. The white surface reads as a
          page laid on the cream canvas and the interface recedes around it;
          the documented 160px minimum, 16px padding and absent resize handle
          all now come from the primitive itself.

          It grows past the 160px minimum so the room to think is literal,
          but stops short of the full screen. It is also drawn on the canvas
          rather than filled white: a white block this large dominated the
          screen and read as a panel, where an outlined region of the page
          simply reads as somewhere to write.
        */}
        <Textarea
          autoFocus
          placeholder={t("why.placeholder")}
          aria-invalid={Boolean(form.formState.errors.why)}
          className="mt-8 max-h-96 flex-1"
          {...form.register("why")}
        />
        {form.formState.errors.why ? (
          <p className="text-danger text-small mt-2 shrink-0">
            {t("why.error")}
          </p>
        ) : null}
      </div>

      <div className="shrink-0 pt-8">
        <Button type="submit" size="lg" className="w-full">
          {t("continue")}
        </Button>
      </div>
    </form>
  );
}
