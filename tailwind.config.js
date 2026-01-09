/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--color-secondary)",
        toolbar: "var(--toolbar-color)",
        statusbar: "var(--statusbar-color)"
      },
      fontSize: {
        primary: "var(--font-primary)",
        secondary: "var(--font-secondary)"
      }
    },
  },
  plugins: [],
};
