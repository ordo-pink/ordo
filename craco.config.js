const { resolve } = require("path")

module.exports = {
  webpack: {
    alias: {
      $assets: resolve("./src/assets"),
      $activities: resolve("./src/activities"),
      $commands: resolve("./src/commands"),
      $containers: resolve("./src/containers"),
      $core: resolve("./src/core"),
      "$file-associations": resolve("./src/file-associations"),
      "$editor-plugins": resolve("./src/editor-plugins"),
    },
  },
}
