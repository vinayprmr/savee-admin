import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        savee: {
          navy: {
            DEFAULT: "#0B2545",
            dark: "#061528",
            light: "#163B66",
            subtle: "#F0F4F8",
          },
          gold: {
            DEFAULT: "#C9A96A",
            dark: "#A68645",
            light: "#DFCA9D",
            subtle: "#FAF6EE",
            shimmer: "#E8D8B5",
          },
          ivory: {
            DEFAULT: "#FBFAF7",
            pure: "#FFFFFF",
            warm: "#F6F4EE",
          },
          slate: {
            50: "#F8FAFC",
            100: "#F1F5F9",
            200: "#E2E8F0",
            300: "#CBD5E1",
            400: "#94A3B8",
            500: "#64748B",
            600: "#475569",
            700: "#334155",
            800: "#1E293B",
            900: "#0F172A",
          },
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(11, 37, 69, 0.05), 0 1px 2px -1px rgba(11, 37, 69, 0.05)",
        card: "0 4px 6px -1px rgba(11, 37, 69, 0.05), 0 2px 4px -2px rgba(11, 37, 69, 0.05)",
        drawer: "0 20px 25px -5px rgba(11, 37, 69, 0.1), 0 8px 10px -6px rgba(11, 37, 69, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
