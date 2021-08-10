module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamilt: {
      serif: ["Montserrat"],
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
