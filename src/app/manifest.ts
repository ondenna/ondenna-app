import type { MetadataRoute } from "next";

import { BACKGROUND_COLOR } from "@/design/tokens";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ondenna",
    short_name: "Ondenna",
    description:
      "Ondenna helps you change one thing at a time through 28-day seasons.",
    start_url: "/",
    display: "standalone",
    background_color: BACKGROUND_COLOR,
    theme_color: BACKGROUND_COLOR,
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
