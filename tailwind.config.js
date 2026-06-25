export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        lucro: {
          bg: "#e8eaf5",
          surface: "#f0f2fa",
          card: "#f5f6fc",
          border: "#c2c7e0",
          accent: "#3a50e8",
          accent2: "#1f35c4",
          accent3: "#5c72f0",
          text: "#080e2e",
          muted: "#505880",
          danger: "#c41f3b",
          warn: "#c45a00",
          ok: "#0a7a4a",
          rust: "#c94020",
          teal: "#0077b8",
          olive: "#7a8a00",
          slate: "#3a4260",
          purple: "#7a00c4",
          hot: "#ff4747",
        },
      },
      fontFamily: {
        sans: ["Verdana", "Geneva", "sans-serif"],
      },
      boxShadow: {
        panel: "0 2px 12px rgba(31, 53, 196, 0.10)",
        dropdown: "0 8px 32px rgba(18, 24, 58, 0.12)",
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
