/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        vscode: {
          bg: "#252526",
          "bg-light": "#2D2D2D",
          sidebar: "#1E1E1E",
          primary: "#0078D4",
          accent: "#D7BA7D",
          text: "#CCCCCC",
          "text-muted": "#808080",
          hover: "#3A3D41",
          border: "#3E3E42",
          input: "#1E1E1E",
          success: "#4EC9B0",
          error: "#F44747",
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
