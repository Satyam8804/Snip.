/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: { to: { opacity: "1" } },
      },
      animation: {
        fadeIn: "fadeIn 0.4s forwards",
      },
    },
  },
  plugins: [],
};
