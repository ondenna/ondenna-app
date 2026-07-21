"use client";

import { motion, useReducedMotion } from "framer-motion";

import { fadeIn } from "@/design/tokens";

/**
 * Fades every route in softly so navigation between screens feels calm.
 * Route templates remount on navigation, which is exactly what we want here.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div {...fadeIn(Boolean(reducedMotion))}>{children}</motion.div>
  );
}
