/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0B1120",
        surface: {
          DEFAULT: "#111C33",
          hover: "#162444",
          border: "#1E3A5F",
        },
        accent: {
          DEFAULT: "#4DA3FF",
          dark: "#1A365D",
          light: "#70B7FF",
        },
        verdict: {
          verified: "#10B981",
          misleading: "#F59E0B",
          fabricated: "#EF4444",
          manipulated: "#EF4444",
          unverified: "#94A3B8",
        },
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "shimmer": "shimmer 2s linear infinite",
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
}

