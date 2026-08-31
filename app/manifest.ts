import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BOS — Software Developer Portfolio",
    short_name: "BOS",
    description:
      "Personal portfolio of BOS, a software developer building high-performance web applications, game modding systems, native software, and interactive tools.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
