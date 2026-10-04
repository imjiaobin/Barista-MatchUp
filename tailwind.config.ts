import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: "#F7F1DE", light: "#faf8f5" },
        latte: "#ecd6bf",
        mocha: "#d2a682",
        caramel: { DEFAULT: "#b5592a", dark: "#8B4513" },
        espresso: "#4E220F",
        olive: "#607456",
        ink: { DEFAULT: "#2b2420", muted: "#6b5f57" },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "var(--font-noto-sans-tc)",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
