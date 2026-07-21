import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // Ondenna geometry, per docs/ui-rules.md: 56px tall, 16px padding,
        // 16px text, 16px radius. Large enough for comfortable touch, and
        // well past the 44px minimum target.
        //
        // The field is drawn on the canvas rather than filled white: a white
        // box on cream reads as a web form, and writing directly on the page
        // is the point. That makes the border the only thing identifying the
        // control, which is why it uses control-border (3.2:1) rather than
        // the decorative border tone.
        //
        // Focus is a crisp accent boundary plus a soft halo — 3.7:1 on its
        // own, without the loud 3px ring it used to carry.
        "border-control-border file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 disabled:bg-muted/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 text-body file:text-small h-[var(--size-input-height)] w-full min-w-0 rounded-md border bg-transparent px-4 py-2 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium focus-visible:ring-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-2",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
