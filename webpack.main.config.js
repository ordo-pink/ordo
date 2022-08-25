const { resolve } = require("path");

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/index.ts",
  // Put your normal webpack config below here
  module: {
    rules: require("./webpack.rules"),
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
    alias: {
      "@core": resolve("./src/core"),
      "@containers": resolve("./src/containers"),
      "@components": resolve("./src/components"),
      "@init": resolve("./src/init"),
      "@modules": resolve("./src/modules"),
      "@utils": resolve("./src/utils"),
      "@i18n": resolve("./i18n"),
    },
  },
};
