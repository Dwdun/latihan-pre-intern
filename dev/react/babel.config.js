// Mengubah JSX dan import/export agar bisa dijalankan Jest. Jangan diubah.
module.exports = {
  presets: [["@babel/preset-react", { runtime: "automatic" }]],
  plugins: ["@babel/plugin-transform-modules-commonjs"],
};
