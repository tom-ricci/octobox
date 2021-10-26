module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint",
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": [
      "off"
    ],
    "@typescript-eslint/no-empty-interface": [
      "off"
    ],
    "@typescript-eslint/type-annotation-spacing": [
      "warn"
    ],
    "func-call-spacing": [
      "error",
      "never"
    ],
    "block-spacing": [
      "error",
      "always"
    ],
    "comma-spacing": [
      "error",
      { "before": false, "after": true }
    ],
    "keyword-spacing": [
      "error",
      { "overrides":
          {
            "as": { "before": true, "after": true },
            "async": { "before": true, "after": true },
            "await": { "before": true, "after": true },
            "break": { "before": false, "after": false },
            "case": { "before": false, "after": true },
            "catch": { "before": false, "after": false },
            "class": { "before": true, "after": true },
            "const": { "before": false, "after": true },
            "continue": { "before": true, "after": true },
            "debugger": { "before": false, "after": false },
            "default": { "before": true, "after": true },
            "delete": { "before": false, "after": true },
            "do": { "before": false, "after": false },
            "else": { "before": false, "after": false },
            "export": { "before": false, "after": true },
            "extends": { "before": true, "after": true },
            "finally": { "before": false, "after": false },
            "for": { "before": false, "after": false },
            "from": { "before": true, "after": true },
            "function": { "before": true, "after": false },
            "get": { "before": false, "after": true },
            "if": { "before": false, "after": false },
            "import": { "before": false, "after": true },
            "instanceof": { "before": true, "after": true },
            "let": { "before": false, "after": true },
            "new": { "before": true, "after": true },
            "of": { "before": true, "after": true },
            "return": { "before": false, "after": true },
            "set": { "before": false, "after": true },
            "static": { "before": false, "after": true },
            "super": { "before": false, "after": false },
            "switch": { "before": false, "after": false },
            "this": { "before": false, "after": false },
            "throw": { "before": false, "after": true },
            "try": { "before": false, "after": true },
            "typeof": { "before": true, "after": true },
            "var": { "before": true, "after": true },
            "void": { "before": true, "after": true },
            "while": { "before": false, "after": false },
            "with": { "before": false, "after": false },
            "yield": { "before": false, "after": true }
          }
      }
    ],
    "prefer-template": [
      "warn"
    ],
    "arrow-spacing": [
      "error",
      { "before": true, "after": true }
    ],
    "no-unused-vars": [
      "off"
    ],
    "no-undef": [
      "off"
    ],
    "template-curly-spacing": [
      "error", "never"
    ],
    "object-curly-spacing": [
      "error", "always"
    ],
    "indent": [
      "error",
      2,
      { "SwitchCase": 1 }
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
  }
};