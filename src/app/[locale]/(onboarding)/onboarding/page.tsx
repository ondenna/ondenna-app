import { setRequestLocale } from "next-intl/server";

import { OnboardingFlow } from "@/features/season";

export default async function OnboardingPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <OnboardingFlow />;
}
