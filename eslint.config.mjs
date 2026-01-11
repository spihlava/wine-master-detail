import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Allow console.error and console.warn, warn on console.log
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // Enforce consistent import ordering
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "type",
          ],
          "newlines-between": "never",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      // Disallow unused variables (warning level to not break builds)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Prefer const over let when variable is not reassigned
      "prefer-const": "warn",
      // Enforce consistent return types
      "@typescript-eslint/explicit-function-return-type": "off",
      // Allow any in specific cases but warn
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);

export default eslintConfig;
