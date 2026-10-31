/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: {
          50: "#f4f7f5",
          100: "#e3e9e5",
          200: "#c6d2cb",
          300: "#9fb0a5",
          400: "#71897c",
          500: "#4f6b5c",
          600: "#3a5347",
          700: "#2d4138",
          800: "#1f2e27",
          900: "#14201c",
          950: "#0b1310"
        },
        moss: {
          50: "#eef7f1",
          100: "#d7ecdf",
          200: "#aedac1",
          300: "#7fc19f",
          400: "#4ea37c",
          500: "#1f7a5c",
          600: "#186249",
          700: "#144e3b",
          800: "#113f30",
          900: "#0e3328",
          950: "#071d17"
        },
        amber: {
          50: "#fdf6ea",
          100: "#faeaca",
          200: "#f3d191",
          300: "#ecb95c",
          400: "#e8a33d",
          500: "#d98c22",
          600: "#b56f18",
          700: "#8f5616",
          800: "#714417",
          900: "#5c3815"
        },
        brick: {
          400: "#d6786c",
          500: "#c4493d",
          600: "#a63a30"
        }
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(20 32 28 / 0.04), 0 1px 1px 0 rgb(20 32 28 / 0.03)",
        raised: "0 8px 24px -8px rgb(20 32 28 / 0.18)"
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: []
};
