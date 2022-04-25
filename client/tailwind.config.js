module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#f0edf4",
        button: "#6366f1",
        overlay: "rgb(0, 0, 0, 0.35)",
      },
      listStyleType: {
        circle: "circle",
      },
      aspectRatio: {
        "1/3": "1 / 3",
        "3/4": "3 / 4",
        "3/5": "3 / 5",
      },
    },
    fontFamily: {
      body: "Nunito, sans-serif",
      logo: "SVN-Kashima Brush",
    },
  },
  plugins: [],
};
