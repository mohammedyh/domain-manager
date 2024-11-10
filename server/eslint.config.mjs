import globals from "globals";
import js from "@eslint/js";
import securityPlugin from "eslint-plugin-security";

/** @type {import('eslint').Linter.Config} */
export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      securityPlugin,
    },
    rules: {
      "no-unused-vars": [
        "error",
        {
          caughtErrors: "none",
          argsIgnorePattern: "_",
        },
      ],
    },
  },
];
