/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        vscode: {
          bg: "rgb(var(--color-bg) / <alpha-value>)",
          "bg-light": "rgb(var(--color-bg-light) / <alpha-value>)",
          sidebar: "rgb(var(--color-sidebar) / <alpha-value>)",
          primary: "rgb(var(--color-primary) / <alpha-value>)",
          accent: "rgb(var(--color-accent) / <alpha-value>)",
          text: "rgb(var(--color-text) / <alpha-value>)",
          "text-muted": "rgb(var(--color-text-muted) / <alpha-value>)",
          hover: "rgb(var(--color-hover) / <alpha-value>)",
          border: "rgb(var(--color-border) / <alpha-value>)",
          input: "rgb(var(--color-input) / <alpha-value>)",
          success: "rgb(var(--color-success) / <alpha-value>)",
          error: "rgb(var(--color-error) / <alpha-value>)",
          heading: "rgb(var(--color-heading) / <alpha-value>)",
          glass: "rgb(var(--color-glass) / <alpha-value>)",
          overlay: "rgb(var(--color-overlay) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: [
          "Segoe UI", "system-ui", "-apple-system",
          "BlinkMacSystemFont", "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
