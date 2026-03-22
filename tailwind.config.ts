import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'timmos-blue': '#3D5A73',   // Bleu de votre logo
        'timmos-cream': '#F5F5F0',  // Blanc cassé / Crème
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
