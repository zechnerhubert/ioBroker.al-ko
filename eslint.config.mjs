// eslint.config.mjs
import config from "@iobroker/eslint-config";

export default [
  // 1) Zuerst die Basiskonfiguration
  ...config,

  // 2) Ignorierte Pfade (jsonConfig NICHT ignorieren!)
  {
    ignores: [
      "node_modules/",
      "dist/",
      "coverage/",
    ],
  },

  // 3) JSON-Dateien explizit erlauben (nach dem Spread, damit es gewinnt)
  {
    files: ["**/*.json"],
    languageOptions: {
      parserOptions: {
        extraFileExtensions: [".json"],
      },
    },
  },

  // 4) Projektweite Regelanpassungen
  {
    rules: {
      // Deine bisherigen Overrides
      "@typescript-eslint/no-empty-object-type": "off",
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "@typescript-eslint/no-unused-vars": [
        "off",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],

      // Neu: Keine Code-Änderungen erzwingen
      // -> erlaubt einzeilige ifs; nur mehrzeilige brauchen Klammern
      "curly": ["error", "multi-line"],

      // -> schaltet stilistische Klammer-Layout-Prüfungen ab
      "brace-style": "off",

      // -> Prettier-Durchsetzung aus; sonst will er umformatieren
      "prettier/prettier": "off",
    },
  },
];
