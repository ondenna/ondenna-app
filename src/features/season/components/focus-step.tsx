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
        <h1 className="text-h1 text-balance">{t("focus.question")}</h1>

        <Input
          autoFocus
          placeholder={t("focus.placeholder")}
          aria-invalid={Boolean(form.formState.errors.focus)}
          className="mt-8"
          {...form.register("focus")}
        />
        {form.formState.errors.focus ? (
          <p className="text-danger text-small mt-2">{t("focus.error")}</p>
        ) : null}
      </div>

      {/*
        Gentle inspiration, not a category picker. These were pills, which
        read as selectable habit-tracker tags; as a quiet list they look like
        examples written in the margin, which is what they are. Behaviour is
        unchanged — tapping one fills the field. Rows are a full 44px so they
        stay comfortable to hit despite the light treatment.
      */}
      <section className="mt-10">
        <h2 className="text-muted-foreground text-small font-sans font-normal">
          {t("focus.examplesLabel")}
        </h2>
        <ul className="mt-2">
          {EXAMPLE_KEYS.map((key) => (
            <li key={key}>
              <button
                type="button"
                onClick={() =>
                  form.setValue("focus", t(`focus.examples.${key}`), {
                    shouldValidate: true,
                  })
                }
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-body flex min-h-[var(--size-touch-target-min)] w-full items-center rounded-sm text-left transition-colors outline-none focus-visible:ring-3"
              >
                {t(`focus.examples.${key}`)}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Bottom zone: the action stays thumb-reachable, and keeps clear of
          the suggestions when the keyboard shrinks the viewport. */}
      <div className="mt-auto pt-8">
        <Button type="submit" size="lg" className="w-full">
          {t("continue")}
        </Button>
      </div>
    </form>
  );
}
