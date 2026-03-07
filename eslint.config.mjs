// eslint.config.mjs
import config from "@iobroker/eslint-config";

export default [
  {
    ignores: [
      "node_modules/",
      "dist/",
      "coverage/",
      ".dev-server/**",
      "package/**",
      "build/**",
      "admin/jsonConfig.json", // JSON von Lint ausschließen
    ],
  },
  ...config,
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "@typescript-eslint/no-unused-vars": [
        "off",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
