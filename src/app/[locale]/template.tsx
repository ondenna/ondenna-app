"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Fades every route in softly so navigation between screens feels calm.
 * Route templates remount on navigation, which is exactly what we want here.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
