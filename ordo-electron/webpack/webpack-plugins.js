// eslint-disable-next-line
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const { ProvidePlugin } = require("webpack")

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new CopyPlugin({ patterns: [{ from: "./src/assets", to: "src/assets" }] }),
  new ProvidePlugin({
    // Make a global `process` variable that points to the `process` package,
    // because the `util` package expects there to be a global variable named `process`.
    // Thanks to https://stackoverflow.com/a/65018686/14239942
    process: "process/browser",
  }),
]
