const { resolve } = require("path")

module.exports = {
  webpack: {
    alias: {
      $assets: resolve("./src/assets"),
      $containers: resolve("./src/containers"),
      $activities: resolve("./src/activities"),
      $commands: resolve("./src/commands"),
      $associations: resolve("./src/associations"),
      $core: resolve("./src/core"),
    },
  },
}
