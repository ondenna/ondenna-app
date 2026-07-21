import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Ondenna geometry, per docs/ui-rules.md: 160px minimum, 16px
        // padding, 16px radius, and no resize handle — reflection deserves
        // a settled writing space, not a control the user has to adjust.
        // Surface and focus treatment match Input; see the note there.
        "border-control-border placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 disabled:bg-muted/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 text-body flex field-sizing-content min-h-[var(--size-textarea-min-height)] w-full resize-none rounded-md border bg-transparent p-4 transition-colors outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-2",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
