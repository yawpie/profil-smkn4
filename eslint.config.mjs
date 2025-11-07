import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: ['./tsconfig.json'] }, // optional but fine
    },
    plugins: {
      next: nextPlugin, // load Next rules
    },
    rules: {
      // Either form works once the plugin is loaded:
      '@next/next/no-img-element': 'off',
      // or:
      // 'next/no-img-element': 'off',
    },
  },
];

export default eslintConfig;
