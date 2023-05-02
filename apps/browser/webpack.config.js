const { withReact } = require("@nrwl/react")
const { composePlugins, withNx } = require("@nrwl/webpack")
const { EnvironmentPlugin } = require("webpack")

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx(),
  withReact({ postcssConfig: "./apps/browser/postcss.config.js" }),
  (config) => {
    // Update the webpack config as needed here.

    config.plugins.push(
      new EnvironmentPlugin(["BACKEND_HOST", "AUTH_HOST", "AUTH_REALM", "AUTH_CLIENT_ID"]),
    )

    return config
  },
)
