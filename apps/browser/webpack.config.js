const { withReact } = require("@nrwl/react")
const { composePlugins, withNx } = require("@nrwl/webpack")

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx(),
  withReact({ postcssConfig: "./apps/browser/postcss.config.js" }),
  (config) => {
    // Update the webpack config as needed here.
    return config
  },
)
