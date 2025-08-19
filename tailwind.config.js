import colors from 'tailwindcss/colors';

export const themeColors = {
  primary: 'var(--primary)',
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  secondary: '#7C3AED',
  success: colors.green[500],
  warning: colors.yellow[400],
  error: colors.red[500],
  backgroundLight: '#FEFAEF',
};

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: themeColors,
    },
  },
  plugins: [],
};
