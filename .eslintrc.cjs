/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    "next/core-web-vitals",
    "prettier",
    "plugin:tailwindcss/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    projectService: true,
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint", "prettier"],
  root: true,
  rules: {
    "prettier/prettier": "error",
  },
};
