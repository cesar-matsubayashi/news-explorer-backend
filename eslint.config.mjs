import globals from "globals";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
    },

    rules: {
      quotes: ["error", "double"],
      "no-underscore-dangle": [
        "error",
        {
          allow: ["_id"],
        },
      ],

      "no-console": "off",
      "linebreak-style": 0,
      "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
    },
  },
];
