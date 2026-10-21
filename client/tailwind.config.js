/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf1ef',
          100: '#fbe0db',
          200: '#f6c1b6',
          300: '#f09c8b',
          400: '#e96f57',
          500: '#e74c3c',
          600: '#c0392b',
          700: '#9d2f22',
          800: '#7a251b',
          900: '#5c1c14',
        },
        ink: {
          50: '#eef1f4',
          100: '#d4dbe2',
          200: '#a9b7c4',
          300: '#7e93a7',
          400: '#546f89',
          500: '#3d5871',
          600: '#2c3e50',
          700: '#233242',
          800: '#1a2632',
          900: '#121a22',
        },
        accent: {
          400: '#5dade2',
          500: '#3498db',
          600: '#2980b9',
        },
        cream: '#f8f9fa',
        gold: '#d4af37',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 15px rgba(0,0,0,0.08)',
        card: '0 10px 30px rgba(23, 32, 42, 0.08)',
        lift: '0 20px 40px rgba(23, 32, 42, 0.15)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
