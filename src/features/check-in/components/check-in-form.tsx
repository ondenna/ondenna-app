"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { fadeIn } from "@/design/tokens";
import {
  CHECK_IN_NOTE_MAX_LENGTH,
  checkInFormSchema,
  normalizeNote,
  type CheckInFormValues,
} from "@/features/check-in/schemas/check-in";
import { useCheckInStore, type CheckIn } from "@/stores/check-ins";

interface CheckInFormProps {
  /** Local calendar date this form saves to — today's or yesterday's. */
  date: string;
  /** The question shown above Yes/No; today and yesterday phrase it differently. */
  question: string;
  existing?: CheckIn;
  onSaved: () => void;
  /** Present only when there is somewhere calm to return to without saving. */
  onCancel?: () => void;
}

/**
 * The one check-in form, shared by today and yesterday (docs/screens.md 4).
 * Presentation only — persistence goes through useCheckInStore, and which
 * date is being edited is entirely the caller's decision.
 */
export function CheckInForm({
  date,
  question,
  existing,
  onSaved,
  onCancel,
}: CheckInFormProps) {
  const t = useTranslations("dashboard.checkIn");
  const reducedMotion = useReducedMotion();
  const saveCheckIn = useCheckInStore((s) => s.saveCheckIn);
  const legendId = useId();
  const answerErrorId = useId();
  const [noteOpen, setNoteOpen] = useState(Boolean(existing?.note));

  const form = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInFormSchema),
    defaultValues: {
      answer: existing?.answer,
      note: existing?.note ?? "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    // The schema's refine already guarantees this; narrows the type for TS.
    if (!values.answer) return;
    saveCheckIn(date, values.answer, normalizeNote(values.note));
    onSaved();
  });

  const noteLength = (form.watch("note") ?? "").length;

  return (
    <form onSubmit={onSubmit} noValidate>
      <h2 id={legendId} className="text-body font-sans font-medium">
        {question}
      </h2>

      <Controller
        control={form.control}
        name="answer"
        render={({ field }) => (
          <RadioGroup
            className="mt-6"
            aria-labelledby={legendId}
            aria-describedby={
              form.formState.errors.answer ? answerErrorId : undefined
            }
            // "" rather than undefined: Base UI treats an undefined value as
            // uncontrolled, and warns on the switch once an answer is
            // picked. "" never matches an item's value, so nothing renders
            // as selected until the user actually chooses one.
            value={field.value ?? ""}
            onValueChange={(value) => field.onChange(value)}
          >
            <RadioGroupItem value="yes">{t("yes")}</RadioGroupItem>
            <RadioGroupItem value="no">{t("no")}</RadioGroupItem>
          </RadioGroup>
        )}
      />
      {form.formState.errors.answer ? (
        <p id={answerErrorId} className="text-danger text-small mt-2">
          {t("answerRequired")}
        </p>
      ) : null}

      {!noteOpen ? (
        <button
          type="button"
          onClick={() => setNoteOpen(true)}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-small mt-6 flex min-h-[var(--size-touch-target-min)] items-center rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-3"
        >
          {t("addNote")}
        </button>
      ) : (
        <AnimatePresence>
          <motion.div {...fadeIn(Boolean(reducedMotion))} className="mt-6">
            <label htmlFor="check-in-note" className="sr-only">
              {t("addNote")}
            </label>
            <Textarea
              id="check-in-note"
              placeholder={t("notePlaceholder")}
              aria-invalid={Boolean(form.formState.errors.note)}
              aria-describedby="check-in-note-count"
              {...form.register("note")}
            />
            <div className="mt-2 flex items-start justify-between gap-4">
              {form.formState.errors.note ? (
                <p className="text-danger text-small">
                  {t("noteTooLong", { max: CHECK_IN_NOTE_MAX_LENGTH })}
                </p>
              ) : (
                <span />
              )}
              <p
                id="check-in-note-count"
                className="text-muted-foreground text-caption shrink-0"
              >
                {t("noteCount", {
                  count: noteLength,
                  max: CHECK_IN_NOTE_MAX_LENGTH,
                })}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      <div className="mt-8">
        <Button type="submit" size="lg" className="w-full">
          {t("save")}
        </Button>
        {onCancel ? (
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="text-muted-foreground mt-2 w-full"
            onClick={onCancel}
          >
            {t("cancel")}
          </Button>
        ) : null}
      </div>
    </form>
  );
}
