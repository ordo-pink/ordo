module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    "jest/globals": true,
  },
  root: true,
  plugins: [
    "@typescript-eslint",
    "import",
    "prettier",
    "jest",
    "jsx-a11y",
    "react",
    "react-hooks",
    "testing-library",
    "css",
    "html",
    "i18next",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:jsx-a11y/recommended",
    "plugin:i18next/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jest/recommended",
    "plugin:testing-library/react",
    "plugin:testing-library/dom",
  ],
  rules: {
    "no-console": "warn",
    "import/order": [
      "warn",
      {
        alphabetize: {
          caseInsensitive: true,
          order: "asc",
        },
        groups: ["builtin", "external", "index", "sibling", "parent", "internal"],
      },
    ],
    "@typescript-eslint/no-var-requires": "off",
    "i18next/no-literal-string": "warn",
    "jsx-a11y/no-autofocus": "off",
  },
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
}
