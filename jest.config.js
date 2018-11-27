module.exports = {
    transform: {
      "^.+\\.ts?$": "ts-jest"
    },
    moduleFileExtensions: [
      "ts",
      "tsx",
      "js",
      "jsx"
    ],
    modulePathIgnorePatterns: [
    "./coverage/*",
    "./jest.config.js",
    "./dist/*"
    ],
    testMatch: [
      '**/tests/**/*.test.(ts|js)'
    ],
  }