/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'h-[80]',
    'w-[80]',
    'w-[100%]',
    'top-[94]'
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom': '0px 4px 12px rgba(0, 0, 0, 0.1)', // Custom shadow
      },
      animation: {
        slowBounce: "slowBounce 3s ease-in-out infinite", // Slow and continuous bounce
      },
      keyframes: {
        slowBounce: {
          "0%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(-10px)" }, // Less intense bounce
          "50%": { transform: "translateY(0)" },
          "70%": { transform: "translateY(-5px)" }, // Even more subtle bounce
          "100%": { transform: "translateY(0)" },
        },
      },
      colors: {
        primary: "#13a09d", // You can use this class as `bg-primary` or `text-primary`
        secondary: "#5852E9",
        orange: "#E67300",
        yellow: "#FFBE55",
        green: "#3BB537",
        red: "#FF3E1C",
        grey: "#6D6D6D",
        redish: "#C6BCBC",
        bg: "#D9D9D9", // Background utility, `bg-bg`
        white: "#FFFFFF", // Used as `text-white`
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'], // Make sure Roboto is available in your project
      },
      fontSize: {
        h1: ['40px', { lineHeight: '47px' }],
        h2: ['25px', { lineHeight: '29px' }],
        p1: ['20px', { lineHeight: '23px' }],
        btnText: ['20px', { lineHeight: '23px' }],
        p2: ['18px', { lineHeight: '21px' }],
        p3: ['16px', { lineHeight: '19px' }],
        text: ['25px', { lineHeight: '29px' }],
        h3: ['18px', { lineHeight: '21px' }],
      },
    },
  },
  plugins: [],
};
