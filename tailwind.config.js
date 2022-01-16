module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      'uhd': '3840px'
    },
    extend: {
      backgroundImage: {
        'sport': "url('/src/images/bg-sport2.png')",
        'nutrition': "url('/src/images/bg-nutrition.png')",
        'landing-main': "linear-gradient(to left top, rgba(0,0,0,0.4), rgba(0,0,0,0.1)), linear-gradient(to right bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.1)), url('/src/images/wallpaper01.jpg')",
        'landing-nutrition': "linear-gradient(to left top, rgba(0,0,0,0.5), rgba(0,0,0,0.1)), linear-gradient(to right bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.1)), url('/src/images/test07.jpg')",
        'landing-sport': "url('/src/images/wallpaper05.jpg')"
      },
      transisionProperty: {
        'height': 'height'
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-in forwards",
        fall: "fall 0.25s ease-in forwards"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        fall: {
          "0%": { transform: 'translate(0, -100%)' },
          "100%": { transform: 'translate(0, 0%)' }
        }
      },
      variants: {
        animation: ["motion-safe"]
      },
    },
  },
  plugins: [],
}
