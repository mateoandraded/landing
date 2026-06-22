import forms from '@tailwindcss/forms'

export default {
  content: [
    "./index.html",
    "./assets/**/*.{js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [forms],
}