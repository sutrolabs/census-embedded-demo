/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.js", "./components/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['"Inter Variable"', "sans-serif"],
      },
      keyframes: {
        ["shine-infinite"]: {
          "0%": {
            transform: "skew(-12deg) translateX(-60%)",
          },
          "100%": {
            transform: "skew(-12deg) translateX(60%)",
          },
        },
      },
    },
  },
  plugins: [],
}
