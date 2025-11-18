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
    // Workspace-specific ignores
    "node_modules/**",
    "scripts/**",
    "test-results/**",
    "public/manifest.json",
  ]),
  {
    rules: {
      // Disable react-hooks/refs rule for our animation hooks
      // since they properly handle refs without accessing .current during render
      "react-hooks/refs": "off",
    },
  },
]);

export default eslintConfig;
