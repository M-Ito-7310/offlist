import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007AFF',
          dark: '#0A84FF',
        },
        success: '#34C759',
        warning: '#FF9500',
        danger: '#FF3B30',
        background: {
          light: '#F2F2F7',
          dark: '#000000',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1C1C1E',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
