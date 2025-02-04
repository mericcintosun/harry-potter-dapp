/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1c2340",
        secondary: "#4b0082",
        accent: "#ffd700",
        dark: "#2c2c2c",
        silver: "#c0c0c0",
      },
    },
  },
  plugins: [],
};
