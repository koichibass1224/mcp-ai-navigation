/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple HIG Dark Mode Colors
        'surface': '#1c1c1e',
        'elevated': '#2c2c2e',
        'separator': '#38383a',

        // Apple System Colors
        'apple-blue': '#0a84ff',
        'apple-green': '#30d158',
        'apple-orange': '#ff9f0a',
        'apple-red': '#ff453a',
        'apple-purple': '#bf5af2',
        'apple-cyan': '#64d2ff',

        // Legacy (互換性のため残す)
        'nav-bg': '#1c1c1e',
        'nav-panel': '#2c2c2e',
        'nav-text': '#e0e0e0',
        'nav-route': '#64d2ff',
        'nav-origin': '#30d158',
        'nav-destination': '#ff453a',
        'nav-button': '#0a84ff',
        'nav-ai': '#bf5af2',
      },
      boxShadow: {
        'dark-sm': '0 1px 2px rgba(0, 0, 0, 0.5)',
        'dark-md': '0 4px 6px rgba(0, 0, 0, 0.5)',
        'dark-lg': '0 10px 15px rgba(0, 0, 0, 0.5)',
        'glow-blue': '0 0 20px rgba(10, 132, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(191, 90, 242, 0.3)',
        'glow-cyan': '0 0 20px rgba(100, 210, 255, 0.3)',
      },
    },
  },
  plugins: [],
}
