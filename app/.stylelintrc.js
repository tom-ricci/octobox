module.exports = {
  "extends": [
    "stylelint-config-standard-scss",
    "stylelint-config-octobox"
  ],
  "rules": {
    "scss/at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": [ "tailwind" ]
      }
    ]
  }
};