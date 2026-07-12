/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#000000",        // primary black (text, buttons)
        ink2: "#111111",       // near-black (surfaces, footer)
        slate: "#6B7280",      // muted gray text
        line: "#E5E5E5",       // borders / dividers
        mist: "#F5F5F5",       // section backgrounds
        paper: "#FFFFFF",      // base background
        accent: {
          DEFAULT: "#6366F1",  // LinkPilot violet-blue
          50: "#EEF0FE",
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
