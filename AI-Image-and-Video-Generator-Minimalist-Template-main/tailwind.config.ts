import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "1.25rem",
        md: "1rem",
        sm: "0.5rem",
      },
      colors: {
        background: "#050505",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#A855F7",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      addCommonColors: true,
      defaultTheme: "dark",
      themes: {
        dark: {
          colors: {
            background: "#050505",
            card: "#0A0A0A",
          }
        }
      }
    }),
  ],
};
export default config;