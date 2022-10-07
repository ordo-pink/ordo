// eslint-disable-next-line
const alias = require("./webpack-alias")
// eslint-disable-next-line
const rules = require("./webpack-rules")
// eslint-disable-next-line
const plugins = require("./webpack-plugins")

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }, { loader: "postcss-loader" }],
})

module.exports = {
  module: { rules },
  plugins: plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    alias,
  },
}
