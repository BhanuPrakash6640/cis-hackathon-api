/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#050816",
        panel: "rgba(8, 15, 29, 0.86)",
        stroke: "rgba(148, 163, 184, 0.14)",
      },
      fontFamily: {
        sans: ['"Manrope"', "ui-sans-serif", "system-ui"],
        display: ['"Sora"', "ui-sans-serif", "system-ui"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        panel:
          "0 28px 90px rgba(2, 6, 23, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        glow:
          "0 0 0 1px rgba(125, 211, 252, 0.14), 0 18px 46px rgba(56, 189, 248, 0.14)",
        "glow-strong":
          "0 0 0 1px rgba(103, 232, 249, 0.16), 0 26px 80px rgba(14, 165, 233, 0.2)",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
