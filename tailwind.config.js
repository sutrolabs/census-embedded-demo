/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.js", "./components/**/*.js"],
  theme: {
    extend: {
      colors: {
        plum: {
          500: "#4640EB",
        },
      },
      fontFamily: {
        sans: [
          '"IBM Plex Sans", "sans-serif"',
          {
            fontFeatureSettings: '"cv08", "cpsp", "tnum"',
          },
        ],
      },

      fontSize: {
        xxs: "0.7rem",
        xs: "0.75rem",
        sm: "0.8125rem",
        base: ".875rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.563rem",
        "3xl": "1.953rem",
        "4xl": "2.441rem",
        "5xl": "3.052rem",
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
      backgroundImage: {
        "development-warning":
          "repeating-linear-gradient(-45deg, rgba(70, 64, 235, 0.07), rgba(70, 64, 235, 0.07) 6px, rgba(70, 64, 235, 0.1) 6px, rgba(70, 64, 235, 0.1) 12px)",
      },
    },
  },
  plugins: [],
}
