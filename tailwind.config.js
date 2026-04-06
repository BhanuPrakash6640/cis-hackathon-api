/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f5f4ef",
        panel: "rgba(15, 23, 42, 0.96)",
        stroke: "rgba(148, 163, 184, 0.18)",
      },
      fontFamily: {
        sans: ['"Manrope"', "ui-sans-serif", "system-ui"],
        display: ['"Sora"', "ui-sans-serif", "system-ui"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        panel: "0 18px 40px rgba(15, 23, 42, 0.14)",
        glow: "0 0 0 1px rgba(148, 163, 184, 0.14), 0 14px 28px rgba(15, 23, 42, 0.14)",
        "glow-strong":
          "0 0 0 1px rgba(56, 189, 248, 0.16), 0 18px 38px rgba(15, 23, 42, 0.18)",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(148, 163, 184, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
