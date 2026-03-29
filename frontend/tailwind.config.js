/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
        colors: {
          lumea: {
            purple: "#7C3AED",
            "purple-light": "#A78BFA",
            dark: "#0A0A0A",
            card: "rgba(255, 255, 255, 0.05)",
            border: "rgba(255, 255, 255, 0.10)",
          }
        }
    },
  },
  plugins: [],
}

