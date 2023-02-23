/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  moduleNameMapper: {
    //eslint-disable-next-line no-useless-escape
    "--(.*)": "<rootDir>/src",
  },
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
}
