import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Sans"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        gym: {
          bg: "#0A0A0B",
          surface: "#141416",
          border: "#1E1E22",
          muted: "#6B6B76",
          text: "#E4E4E7",
          accent: "#3B82F6",
          strength: "#3B82F6",
          conditioning: "#EF4444",
          optional: "#22C55E",
          warmup: "#F59E0B",
        },
      },
    },
  },
  plugins: [],
};
export default config;
