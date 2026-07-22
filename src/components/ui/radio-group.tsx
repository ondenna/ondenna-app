import * as React from "react";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: RadioGroupPrimitive.Props<string>) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid grid-cols-2 gap-4", className)}
      {...props}
    />
  );
}

/**
 * One equal option in a two-way choice (docs/screens.md 4: "two equal, calm
 * buttons"). The whole tile is the radio, per Base UI's radio rendering as a
 * `<span role="radio">`; the dot indicator is kept mounted so its outline is
 * always visible, filling in only when checked — a shape change rather than
 * a colour change, so the state is never colour-only.
 */
function RadioGroupItem({
  className,
  children,
  ...props
}: Radio.Root.Props<string>) {
  return (
    <Radio.Root
      data-slot="radio-group-item"
      className={cn(
        "border-control-border focus-visible:ring-ring data-[checked]:border-accent text-body flex min-h-[var(--size-touch-target-min)] flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border bg-transparent px-6 py-4 font-medium transition-colors outline-none focus-visible:ring-3",
        className,
      )}
      {...props}
    >
      <Radio.Indicator
        keepMounted
        className="border-control-border data-[checked]:border-accent data-[checked]:bg-accent size-[10px] shrink-0 rounded-full border transition-colors"
      />
      {children}
    </Radio.Root>
  );
}

export { RadioGroup, RadioGroupItem };
