module.exports = {
  root: true,
  env: {
    es2021: true,
  },
  plugins: ["prettier", "import", "unused-imports"],
  extends: ["next/core-web-vitals", "plugin:prettier/recommended", "plugin:tailwindcss/recommended"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    "import/order": [
      "error",
      {
        groups: [
          "builtin", // node "builtin" modules
          "external", // "external" modules
          "internal", // "internal" modules
          ["sibling", "parent"], // modules from a "parent" or "sibling" directory. They can be mingled together
          "index", // "index" of the current directory
          "object", // "object"-imports (only available in TypeScript)
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc" /* sort in ascending order. */,
        },
      },
    ],
    "import/no-empty-named-blocks": "error", //https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-empty-named-blocks.md
    "import/no-unresolved": "error", // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-unresolved.md
    "import/extensions": ["error", { js: "ignorePackages", ts: "never", vue: "always" }], // check file extension
    // https://eslint.org/docs/latest/rules/no-restricted-imports'
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [".*"],
            message: "Relative imports are not allowed.",
          },
        ],
      },
    ],
    "unused-imports/no-unused-imports": "error",
    "no-fallthrough": "error",
    "no-constant-condition": ["error", { checkLoops: false }],
    "no-param-reassign": ["error", { props: false }],
    "prettier/prettier": process.env.NODE_ENV === "production" ? "error" : "off",
    "tailwindcss/no-custom-classname": [
      "error",
      {
        whitelist: ["fa", "fa-.*", "svg-inline--fa", "toster", "group"],
      },
    ],
  },
  settings: {
    "import/resolver": {
      jsconfig: {
        config: "jsconfig.json",
      },
    },
    "import/extensions": [".js", ".json"],
    "import/ignore": ["*.(css|json)$"],
  },
}
