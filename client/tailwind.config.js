import headlessuiPlugin from "@headlessui/tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        zinc: {
          925: "rgb(17, 17, 17)"
        }
      },
      fontFamily: {
        sans: ["Geist Sans", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [headlessuiPlugin],
};
