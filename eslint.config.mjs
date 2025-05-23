import pluginJest from "eslint-plugin-jest";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslintConfigPrettier,
  {
    files: [
      "**/*.test.ts",
      "**/*.test.js",
      "**/*-test.js",
      "**/mock*.ts",
      "**/mock*.js",
      "**/__mocks__/**",
      "**/tests/**",
      "**/fakeData/**",
    ],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
    rules: {
      "no-restricted-globals": ["warn", "console"],
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
      "jest/expect-expect": [
        "error",
        {
          assertFunctionNames: [
            "expect",
            "allChecked",
            "requestCheck",
            "getTestAuth",
            "checkResult",
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.js", "**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-restricted-globals": ["warn", "console"],
      "no-var": "error",
      "prefer-const": "error",
      "no-unneeded-ternary": "error",
      "prefer-arrow-callback": "error",
      "no-lonely-if": "error",
      // consistent-return not needed due to noImplicitReturns enabled in tsconfig
      "consistent-return": "off",
      curly: "error",
      indent: "off",
      "@typescript-eslint/indent": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/only-throw-error": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    ignores: [
      "jest.config.js",
      "dist/*",
      "build/*",
      "config/*",
      "eslint-ci.config.mjs",
      "eslint.config.mjs",
    ],
  },
);
