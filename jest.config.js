/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  moduleNameMapper: {
    //eslint-disable-next-line no-useless-escape
    "fs/(.*)": "<rootDir>/src/fs/$1",
    "core/(.*)": "<rootDir>/src/core/$1",
    "user/(.*)": "<rootDir>/src/user/$1",
    "extension-store/(.*)": "<rootDir>/src/extension-store/$1",
  },
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
}
