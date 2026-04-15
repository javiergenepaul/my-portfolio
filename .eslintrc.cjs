module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ["next/core-web-vitals", "next/typescript"],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "prefer-const": "off",
    "react/display-name": "off",
    "react/jsx-no-comment-textnodes": "off",
    "react/no-unescaped-entities": "off",
  },
};
