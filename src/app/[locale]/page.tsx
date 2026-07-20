import { setRequestLocale } from "next-intl/server";

import { SplashScreen } from "@/components/splash-screen";

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <SplashScreen />;
}
