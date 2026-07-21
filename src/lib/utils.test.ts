import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { TYPE_SCALE, cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "text-sm")).toBe("px-2 text-sm");
  });

  it("resolves conflicting Tailwind classes in favor of the last one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("ignores falsy values", () => {
    expect(cn("px-2", false, undefined, null)).toBe("px-2");
  });
});

describe("cn knows the Ondenna type scale", () => {
  /*
   * Regression guard. tailwind-merge assumes an unrecognised `text-*` class
   * is a colour, so before the scale was registered `cn` treated `text-body`
   * as one — and dropping the real colour left primary button labels dark on
   * a dark fill. Silent, and invisible to every existing test.
   */
  it.each([...TYPE_SCALE])("keeps a colour alongside text-%s", (size) => {
    expect(cn("text-primary-foreground", `text-${size}`)).toBe(
      `text-primary-foreground text-${size}`,
    );
  });

  it.each([...TYPE_SCALE])("lets text-%s win over another size", (size) => {
    expect(cn("text-body", `text-${size}`)).toBe(`text-${size}`);
  });

  it("still treats colour tokens as colours", () => {
    expect(cn("text-muted-foreground", "text-foreground")).toBe(
      "text-foreground",
    );
  });

  it("covers every size declared in typography.css", () => {
    const src = dirname(dirname(fileURLToPath(import.meta.url)));
    const css = readFileSync(
      join(src, "design", "tokens", "typography.css"),
      "utf8",
    );
    // `--text-h1: 32px;` counts; `--text-h1--line-height: 1.2;` does not.
    const declared = [...css.matchAll(/^\s*--text-([\w-]+):/gm)]
      .map((match) => match[1] ?? "")
      .filter((name) => !name.includes("--"));

    expect([...declared].sort()).toEqual([...TYPE_SCALE].sort());
  });
});
