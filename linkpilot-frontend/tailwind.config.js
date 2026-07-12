/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink:    "var(--color-ink, #0f0f0f)",
        ink2:   "var(--color-ink2, #1a1a1a)",
        slate:  "var(--color-slate, #6b7280)",
        line:   "var(--color-line, #e5e7eb)",
        mist:   "var(--color-mist, #f0f0f0)",
        paper:  "var(--color-paper, #f9f9f9)",
        accent: {
          DEFAULT: "#6366F1",
          50:  "#EEF0FE",
          100: "#E0E3FD",
          400: "#818CF7",
          500: "#6366F1",
          600: "#4F52D9",
          700: "#3F41B0",
        },
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"], // headings / logo / big type
        body: ["Inter", "sans-serif"],       // paragraphs / UI text
      },
      borderRadius: {
        pill: "999px",
      },
      transitionTimingFunction: {
        pilot: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
