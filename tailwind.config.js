module.exports = {
  mode: "jit",
  content: [
    "./src/**/**/*.{js,ts,jsx,tsx,html,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,html,mdx}",
  ],
  darkMode: "class",
  theme: {
    screens: { md: { max: "1050px" }, sm: { max: "550px" } },
    extend: {
      colors: {
        red: { 900: "#c11818" },
        white: { A700_cc: "#ffffffcc", A700: "#ffffff" },
        black: {
          900: "#000000",
          "900_01": "#010101",
          "900_28": "#00000028",
          "900_e5": "#000000e5",
          "900_19": "#00000019",
        },
        light_green: { 500: "#70d44b", "500_19": "#70d44b19" },
        teal: {
          900: "#124734",
          "900_35": "#12473435",
          A400: "#3be2b2",
          "900_01": "#004737",
        },
       
        gray: {
          100: "#f6f6f6",
          200: "#eeeeee",
          300: "#e2e2e2",
          400: "#afafaf",
          500: "#adadad",
          600: "#6b6b6b",
          900: "#093626",
          "100_99": "#f5f5fa99",
          "200_01": "#ececec",
          "200_02": "#ebebeb",
          "100_90": "#f5f5fa90",
          "600_01": "#7a7d88",
          "300_02": "#e6e6e6",
          "300_01": "#e4e6e7",
          "100_02": "#f2f2f2",
          "100_01": "#f5f5fa",
          "300_90": "#e4e6e790",
          "300_3f": "#dadada3f",
        },
        blue_gray: {
          100: "#d9d9d9",
          200: "#afc5c0",
          300: "#9ba0b1",
          400: "#8083a3",
          900: "#2c2f3a",
          "100_3f": "#d4d4d43f",
          "900_02": "#333333",
          "900_01": "#0c2542",
          "100_90": "#d9d9d990",
          "400_7f": "#827f8e7f",
          "400_02": "#827f8e",
          "400_01": "#7e859b",
        },
        lime: { 200: "#f3efa1" },
        indigo: { 50: "#e2e8f0" },
      },
      fontFamily: {
        dinnextltw: "DIN Next LT W23",
      },
      boxShadow: {
        bs5: "inset 0px 0px  1px 1px #e6e6e6",
        bs4: "0px 16.29px  11px 0px #dadada3f",
        bs3: "0px 19.77px  13px 0px #dadada3f",
        bs1: "0px 14.7px  15px 0px #d4d4d43f",
        bs: "0px 2px  32px 0px #00000028",
        bs2: "0px 6.43px  22px 0px #12473435",
      },
    },
  },corePlugins: {
    aspectRatio: false,
  },
  plugins: [require("@tailwindcss/forms"), require('@tailwindcss/aspect-ratio'),
  function ({ addVariant, e }) {
    addVariant('android', ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.${e(`android${separator}${className}`)}:is-android`;
      });
    });
    addVariant('iphone', ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.${e(`iphone${separator}${className}`)}:is-iphone`;
      });
    });
  
  
      addVariant('chrome', ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.${e(`chrome${separator}${className}`)}:is-chrome`;
      });
    });
  
  
      addVariant('safari', ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.${e(`safari${separator}${className}`)}:is-safari`;
      });
    });
  
  
  
  },



  
],
};
