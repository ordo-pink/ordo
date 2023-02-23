// eslint-disable-next-line
const alias = require("./webpack-alias")
// eslint-disable-next-line
const rules = require("./webpack-rules")

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/main/index.ts",
  // Put your normal webpack config below here
  module: { rules },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
    alias,
  },
}
