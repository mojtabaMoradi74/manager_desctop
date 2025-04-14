/** @type {import('tailwindcss').Config} */
export default {
  // darkMode: "class", // Enable dark mode based on class
  darkMode: ['class', '[class="dark-mode"]'],
  content: ['./src/**/*.{js,ts,jsx,tsx}', './public/index.html'],
  theme: {
    screens: {
      sm: {min: '640px'},
      md: {min: '768px'},
      g: {min: '900px'},
      lg: {min: '1024px'},
      xl: {min: '1280px'},

      'min-sm': {min: '640px'},
      'min-md': {min: '769px'},
      'min-g': {min: '901px'},
      'min-lg': {min: '1025px'},
      'min-xl': {min: '1281px'},

      '2xl': {min: '1536px'},
      'max-2xl': {max: '1535px'},
      // => @media (max-width: 1535px) { ... }
      'max-xl': {max: '1279px'},
      // => @media (max-width: 1279px) { ... }
      'max-g': {max: '899px'},
      'max-lg': {max: '1023px'},
      // => @media (max-width: 1023px) { ... }
      'max-md': {max: '767px'},
      // => @media (max-width: 767px) { ... }
      'max-sm': {max: '639px'},
      // => @media (max-width: 639px) { ... }
    },
    extend: {
      backgroundImage: {
        // helpCenterImage: "url('./public/helpCenterImage1.jpeg')",
        brandPrimary: 'linear-gradient(160.93deg, #41E2A8 12.85%, #B5E157 101.64%)',
      },
      fontFamily: {
        'hubot-sans': ['Hubot-Sans', 'sans-serif'],
      },
      colors: {
        gray: {
          50: 'rgb(var(--gray-50) / <alpha-value>)',
          100: 'rgb(var(--gray-100) / <alpha-value>)',
          200: 'rgb(var(--gray-200) / <alpha-value>)',
          300: 'rgb(var(--gray-300) / <alpha-value>)',
          400: 'rgb(var(--gray-400) / <alpha-value>)',
          500: 'rgb(var(--gray-500) / <alpha-value>)',
          600: 'rgb(var(--gray-600) / <alpha-value>)',
          700: 'rgb(var(--gray-700) / <alpha-value>)',
          800: 'rgb(var(--gray-800) / <alpha-value>)',
          900: 'rgb(var(--gray-900) / <alpha-value>)',
        },
        transparent: 'transparent',
        current: 'currentColor',
        primary: {
          main: '#3BCE99',
          dark: '#247C5C',
          dark1: '#93B9BB',
          var1: '#41E2A8',
          var2: '#B5E157',
          light: '#A8F2D7',
          bg: '#EFF8F5',
          darkBg: '#080B12',
          // darkBoxBg: "#000",
          darkBoxBg: '#0C101B',
          bgLighter: '#EFF8F5',
          bgLighter1: '#ECFCF6',
          bgLighter2: '#F9FAFB',
          var3: '#41D09C',
          grayColor: '#344054',
          grayColor1: '#F2F4F7',
          grayColor2: '#EAECF0',
          borderPeimary: '#D0D5DD',
        },
        pink: {
          50: '#FDF2FA',
          200: '#FCCEEE',
          700: '#C11574',
        },
        // text: {
        // 	primary: "#475467",
        // 	darkPrimary: "#101828",
        // },
        rose: {
          700: '#C01048',
        },
        green: {
          600: '#0B9079',
          950: '#1A2209',
        },
        error: {
          primary: '#F04438',
        },
        linear: {},
        boxShadow: {
          '3xl': '0 10px 90px -3px #41D09C',
          shadow1: '0px 4px 27.1px 0px #00000040',
          shadow2: '0px 4px 27.1px 0px #00000040',
          shadow3: '0px 10px 10px 0px #FF00C733',
        },
        bg: {
          g: '#EFF8F5',
        },
      },
    },
  },
  // plugins: [require('tailwindcss-rtl')],
}
