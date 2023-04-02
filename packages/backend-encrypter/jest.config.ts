/* eslint-disable */
export default {
  displayName: "backend-encrypter",
  preset: "../../jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]sx?$": ["@swc/jest", { jsc: { transform: { react: { runtime: "automatic" } } } }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/packages/backend-encrypter",
}
