// eslint.config.mjs
import config from "@iobroker/eslint-config";

export default [
  {
    ignores: [
      "node_modules/",
      "dist/",
      "coverage/",
      "admin/jsonConfig.json"
    ],
    languageOptions: {
      parserOptions: {
        extraFileExtensions: [".json"],
      },
    },
  },
  ...config,
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "@typescript-eslint/no-unused-vars": [
        "off",
        { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }
      ]
    },
  },
];
