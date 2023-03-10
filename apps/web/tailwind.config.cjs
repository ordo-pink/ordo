const { createGlobPatternsForDependencies } = require("@nrwl/react/tailwind")
const { join } = require("path")

module.exports = {
  content: [
    join(__dirname, "src/**/*!(*.stories|*.spec).{ts,tsx,html,css}"),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: "class",
  theme: {
    extend: {
      transitionProperty: {
        background: "background",
      },
    },
  },
  plugins: [],
}
