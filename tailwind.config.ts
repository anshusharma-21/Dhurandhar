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
        navy: {
          950: "#070b12",
          900: "#0b0f19",
          850: "#0f172a",
          800: "#131c31",
          700: "#1e293b",
          600: "#334155",
        },
        brand: {
          cyan: "#06b6d4",
          sky: "#0ea5e9",
          skyHover: "#0284c7",
          gold: "#f59e0b",
          goldDark: "#d97706",
          goldLight: "#fef3c7",
        },
        surface: {
          warmWhite: "#f8fafc",
          warmMuted: "#f1f5f9",
          cardDark: "#111827",
          borderDark: "#1f2937",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)",
        goldGlow: "0 0 20px -5px rgba(245, 158, 11, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
