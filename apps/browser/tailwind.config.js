const { join } = require("path")
const { createGlobPatternsForDependencies } = require("@nrwl/react/tailwind")

module.exports = {
  content: [
    join(__dirname, "src/**/*!(*.stories|*.spec).{ts,tsx,html,css}"),
    ...createGlobPatternsForDependencies(__dirname),
    join(__dirname, "../../packages/**/*!(*.stories|*.spec).{ts,tsx,html,css}"),
  ],
  theme: {
    extend: {
      transitionProperty: {
        background: "background",
      },
    },
  },
  plugins: [],
}
