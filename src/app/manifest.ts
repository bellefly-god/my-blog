import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jack Wang's Blog - AnyTools",
    short_name: "Jack Wang",
    description: "Discover the best AI tools, developer tools, Web3 tools, and productivity tools. AnyTools helps you find the right tools faster.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}