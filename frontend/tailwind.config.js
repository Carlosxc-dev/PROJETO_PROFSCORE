import PrimeUI from 'tailwindcss-primeui';

export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [PrimeUI],
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
    './src/**/**/*.{html,js,ts,jsx,tsx}',
  ],
};
