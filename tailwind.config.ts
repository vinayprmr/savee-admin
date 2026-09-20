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
        navy: {
          50: "#F0F5FA",
          100: "#E1ECF7",
          200: "#BDD4EB",
          300: "#8BB1D9",
          400: "#5B8EC2",
          500: "#336BA6",
          600: "#255589",
          700: "#1B426F",
          800: "#12335A",
          900: "#0B2545", // Savee Brand Navy
          950: "#051329", // Savee Midnight Dark
          DEFAULT: "#0B2545",
        },
        gold: {
          50: "#FDF9F2",
          100: "#F9F1E2",
          200: "#F3E4C6",
          300: "#EAD2A8",
          400: "#E0C08D",
          500: "#D6AE72", // Official Savee Gold
          600: "#B58832",
          700: "#8E6924",
          800: "#6B4E1B",
          900: "#4B3612",
          DEFAULT: "#D6AE72",
        },
        savee: {
          navy: {
            DEFAULT: "#0B2545",
            dark: "#051329",
            light: "#1B426F",
            subtle: "#F0F5FA",
          },
          gold: {
            DEFAULT: "#D6AE72",
            dark: "#8E6924",
            light: "#EAD2A8",
            subtle: "#FDF9F2",
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
