import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brown: '#9D6638',
        olive: '#607456',
        indigo: '#4E220F',
        cream: '#F7F1DE',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-noto-sans-tc)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
