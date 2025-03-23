/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest", {}],
  },
  silent: true,

  testPathIgnorePatterns: ["/node_modules/", "/__tests__/helpers/*"],
};

