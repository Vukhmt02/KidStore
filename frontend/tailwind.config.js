/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8EC",
        peach: "#FFD6C7",
        mint: "#BFEBD7",
        skysoft: "#C7E7FF",
        lemon: "#FFE9A8",
        berry: "#FF7FA3",
        cocoa: "#5B4B45"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(91, 75, 69, 0.12)"
      }
    }
  },
  plugins: []
};
