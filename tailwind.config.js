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
      height: {
        '1/10': '10vh',
        '1/20': '5vh',
        '9/10': '90vh',
        '19/20': '95vh',
        'header': '5vh',
        'screenMinusHeader': '95vh'
      },
      minHeight: {
        '1/10': '10vh',
        '1/20': '5vh',
        '9/10': '90vh',
        '19/20': '95vh',
        'header': '5vh',
        'screenMinusHeader': '95vh'
      },
      backgroundImage: {
        'sport': "url('/src/images/bg-sport2.png')",
        'nutrition': "url('/src/images/bg-nutrition.png')",
        'landing-main': "linear-gradient(to left top, rgba(0,0,0,0.4), rgba(0,0,0,0.1)), linear-gradient(to right bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.1)), url('/src/images/wallpaper01.jpg')",
        'landing-nutrition': "linear-gradient(to left top, rgba(0,0,0,0.5), rgba(0,0,0,0.1)), linear-gradient(to right bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.1)), url('/src/images/test07.jpg')",
        'landing-sport': "url('/src/images/wallpaper05.jpg')"
      },
      backgroundColor: {
        'energy': 'rgb(50, 205, 50)',
        'fat': 'rgb(255, 255, 0)',
        'carbohydrates': 'rgb(255, 165, 0)',
        'fiber': 'rgb(245, 245, 245)',
        'protein': 'rgb(255, 0, 0)',
        'salt': 'rgb(135, 206, 250)'

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
