import { setRequestLocale } from "next-intl/server";

import { TodayDashboard } from "@/features/check-in";

export default async function TodayPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <TodayDashboard />;
}
