module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: false,
    sourceType: "module"
  },
  plugins: [
    "@typescript-eslint",
    "import",
    "promise",
    "security"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:import/recommended",
    "plugin:promise/recommended",
    "plugin:security/recommended",
    "prettier"
  ],
  rules: {
    "import/no-unresolved": "off",
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        "alphabetize": { "order": "asc" },
        "groups": [["builtin", "external"], ["internal"], ["parent", "sibling", "index"]]
      }
    ],
    "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports" }],
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error"
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: ["tsconfig.base.json"]
      }
    }
  },
  ignorePatterns: ["dist", "build", "coverage", "**/generated/**"]
};
