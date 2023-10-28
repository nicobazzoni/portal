/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans'],
      },
    },
    resolve: {
      fallback: {
        "zlib": false,
        "url": false
      }
    }
  },
  plugins: [],
}