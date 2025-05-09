import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      {
        hoshizora: {
          "primary": "#6096BA",
          "secondary": "#A3CEF1",
          "accent": "#8B8C89",
          "neutral": "#274C77",
          "base-100": "#E7ECEF",
          "base-200": "#CBD0D8",
          "base-300": "#AFB8C6",
          "info": "#A3CEF1",
          "success": "#A7D7C5",
          "warning": "#F7C59F",
          "error": "#E4AEC5",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
        },
      },
      "light",
      "dark",
      "cupcake",
      "winter"
    ],
  },
  plugins: [
    require("daisyui"),
  ],
} satisfies Config;
