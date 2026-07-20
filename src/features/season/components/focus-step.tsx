"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  focusSchema,
  type FocusValues,
} from "@/features/season/schemas/onboarding";
import { useSeasonDraftStore } from "@/stores/season-draft";

const EXAMPLE_KEYS = ["sleep", "write", "move"] as const;

export function FocusStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations("onboarding");
  const focus = useSeasonDraftStore((s) => s.draft.focus);
  const setFocus = useSeasonDraftStore((s) => s.setFocus);

  const form = useForm<FocusValues>({
    resolver: zodResolver(focusSchema),
    defaultValues: { focus },
  });

  // Each step unmounts when the flow moves, so in-progress text is kept in
  // the draft on the way out. Without this, going back would silently
  // discard what the user had typed but not yet submitted.
  useEffect(
    () => () => {
      setFocus(form.getValues("focus").trim());
    },
    [form, setFocus],
  );

  const onSubmit = form.handleSubmit((values) => {
    setFocus(values.focus.trim());
    onNext();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
      <div className="pt-8">
        <h1 className="text-3xl font-medium tracking-tight text-balance">
          {t("focus.question")}
        </h1>
        <Input
          autoFocus
          placeholder={t("focus.placeholder")}
          aria-invalid={Boolean(form.formState.errors.focus)}
          className="mt-8 h-12 text-base"
          {...form.register("focus")}
        />
        {form.formState.errors.focus ? (
          <p className="text-destructive mt-2 text-sm">{t("focus.error")}</p>
        ) : null}
        <p className="text-muted-foreground mt-10 text-sm">
          {t("focus.examplesLabel")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLE_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() =>
                form.setValue("focus", t(`focus.examples.${key}`), {
                  shouldValidate: true,
                })
              }
              className="border-border text-muted-foreground hover:text-foreground rounded-full border px-3.5 py-1.5 text-sm transition-colors"
            >
              {t(`focus.examples.${key}`)}
            </button>
          ))}
        </div>
      </div>
      <Button type="submit" size="lg" className="mt-auto w-full">
        {t("continue")}
      </Button>
    </form>
  );
}
