const { resolve } = require("path")

/** @type {import('@craco/types').CracoConfig} */
module.exports = {
  jest: {
    configure: {
      verbose: true,
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
      moduleNameMapper: {
        '^\\$activities(.*)$': '<rootDir>/src/activities$1',
        '^\\$core(.*)$': '<rootDir>/src/core$1',
        '^\\$containers(.*)$': '<rootDir>/src/containers$1',
        '^\\$commands(.*)$': '<rootDir>/src/commands$1',
        '^\\$editor-plugins(.*)$': '<rootDir>/src/editor-plugins$1',
        '^\\$file-associations(.*)$': '<rootDir>/src/file-associations$1',
        '^\\$assets(.*)$': '<rootDir>/src/assets$1',
      },
    },
  },
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
