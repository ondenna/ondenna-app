export default function manifest() {
  return {
    name: "Ondenna",
    short_name: "Ondenna",
    start_url: "/tr",
    display: "standalone",
    background_color: "#F7F3EC",
    theme_color: "#0F2928",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
