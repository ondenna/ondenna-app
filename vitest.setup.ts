import "@testing-library/jest-dom/vitest";

// jsdom has no PointerEvent constructor. Base UI's interactive primitives
// (Radio, and others as they're adopted) construct one directly on click,
// which throws under jsdom without this. A minimal polyfill is enough —
// tests only need the constructor to exist, not full pointer semantics.
if (typeof window !== "undefined" && !window.PointerEvent) {
  class PointerEventPolyfill extends MouseEvent {
    pointerId = 0;
    pointerType = "mouse";
  }
  // @ts-expect-error -- jsdom's lib.dom types don't model this constructor.
  window.PointerEvent = PointerEventPolyfill;
}
