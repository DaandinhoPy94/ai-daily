/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#0a0a0a",
        card: "#ffffff",
        "card-foreground": "#0a0a0a",
        popover: "#ffffff",
        "popover-foreground": "#0a0a0a",
        primary: "#18181b",
        "primary-foreground": "#fafafa",
        secondary: "#f4f4f5",
        "secondary-foreground": "#18181b",
        muted: "#f4f4f5",
        "muted-foreground": "#71717a",
        accent: "#3b82f6",
        "accent-foreground": "#18181b",
        destructive: "#ef4444",
        "destructive-foreground": "#fafafa",
        border: "#e4e4e7",
        input: "#e4e4e7",
        ring: "#18181b",
      },
    },
  },
  plugins: [],
}

