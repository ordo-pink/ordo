const { resolve } = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const TypeScriptDeclarationPlugin = require("typescript-declaration-webpack-plugin")
const nodeExternals = require("webpack-node-externals")

/** @type {import('webpack').Configuration} */
module.exports = {
  target: "node",
  entry: "./src/index.ts",
  mode: process.env.NODE_ENV ?? "production",
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        use: "json-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      $fs: resolve("./src/fs"),
      $core: resolve("./src/core"),
    },
  },
  output: {
    path: resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: "commonjs",
    globalObject: "this",
  },
  plugins: [
    new TypeScriptDeclarationPlugin({
      removeComments: false,
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "./package.json", to: "./package.json" }],
    }),
  ],
}
