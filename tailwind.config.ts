import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hn: {
          DEFAULT: "#FF6600",
          hover: "#FF7711",
          light: "#FFF4ED",
          dark: "#2A1400",
        },
        dark: {
          bg: "#000000",
          surface: "#0A0A0A",
          elevated: "#121212",
          border: "#262626",
          text: "#EDEDED",
          muted: "#888888",
        },
        light: {
          bg: "#FFFFFF",
          surface: "#FAFAFA",
          elevated: "#F5F5F5",
          border: "#E5E5E5",
          text: "#171717",
          muted: "#666666",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        "3xl": "48rem",
      },
    },
  },
  plugins: [],
};
export default config;
