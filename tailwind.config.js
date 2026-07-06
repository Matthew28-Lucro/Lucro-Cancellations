export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        lucro: {
          bg: "#F5F6F8",
          surface: "#F5F6F8",
          card: "#FFFFFF",
          border: "#E4E5EA",
          accent: "#1B2A4A",
          accent2: "#171A23",
          accent3: "#C9A84C",
          signal: "#FEE42F",
          text: "#171A23",
          muted: "#4A4E5A",
          faint: "#9296A1",
          line: "#E4E5EA",
          danger: "#c41f3b",
          warn: "#C9A84C",
          ok: "#0a7a4a",
          rust: "#c94020",
          teal: "#0077b8",
          olive: "#7a8a00",
          slate: "#3a4260",
          purple: "#7a00c4",
          hot: "#ff4747",
          brand: {
            "navy-ink": "#171A23",
            "navy-tint": "#1B2A4A",
            "signal-gold": "#FEE42F",
            "muted-gold": "#C9A84C",
            paper: "#FFFFFF",
            surface: "#F5F6F8",
            "ink-70": "#4A4E5A",
            "ink-40": "#9296A1",
            line: "#E4E5EA",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "Verdana", "Geneva", "sans-serif"],
        display: ["Space Grotesk", "Inter", "Verdana", "Geneva", "sans-serif"],
        mono: ["Inter", "Consolas", "Liberation Mono", "monospace"],
      },
      boxShadow: {
        panel: "0 2px 12px rgba(23, 26, 35, 0.08)",
        dropdown: "0 8px 32px rgba(23, 26, 35, 0.12)",
      },
      keyframes: {
        cardIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "card-in": "cardIn 240ms ease-out both",
      },
    },
  },
  plugins: [],
};
