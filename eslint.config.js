import js from "@eslint/js";
import ts from "typescript-eslint";
import react from "eslint-plugin-react";
import globals from "globals";

export default [
  {
    ignores: [
      "dist/",
      "node_modules/",
      "coverage/",
      "eslint.config.js",
      "prettier.config.js",
      "vite.config.*",
      "jest.config.*",
      "*.config.js",
      "*.config.cjs",
      "*.config.mjs"
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  {
    files: ["backend/**/*.ts"],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        project: "./backend/tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",

    },
  },
  {
    files: ["frontend/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: "./frontend/tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react,
    },
    rules: {
      ...react.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["shared/**/*.ts"],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        project: "./shared/tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "no-unused-vars": "warn",
    },
  },
];

