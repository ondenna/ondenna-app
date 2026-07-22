/**
 * Warms Turbopack's on-demand route compilation before the timed suite
 * starts. Sprint 2C.1 documented that a cold hit on /today or /onboarding
 * can take long enough to trip a test's own timeout; Sprint 2C.2's check-in
 * journey is the worst case (full onboarding plus two reloads in one test),
 * so this compiles both routes once, up front, instead of raising timeouts
 * across the suite.
 */
async function globalSetup() {
  const baseURL = "http://localhost:3000";
  for (const path of ["/en/onboarding", "/en/today"]) {
    try {
      await fetch(`${baseURL}${path}`);
    } catch {
      // Best-effort warm-up; a failed fetch here just means the first real
      // test pays the cold-compile cost instead, same as before this file.
    }
  }
}

export default globalSetup;
