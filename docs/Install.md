# Install

You can use the default setup, which will bring you through a list of setup prompts to create your app.
```shell
npm create octobox-app@latest
```
> **Note**\
> On Windows, you may need to reassign your `.js` file association from JScript to Node.js

You can also pass arguments to the command instead of using prompts, if you want.
```shell
npm create octobox-app@latest -- argumented $ARGS
```
#### Arguments
| Name                             | Value                   | Required                      | Description                                                            |
|----------------------------------|-------------------------|-------------------------------|------------------------------------------------------------------------|
| `--path`                         | Alphanumeric Characters | Required                      | The name/path of your app. Must be a direct subdirectory of the CWD.   |
| `--tailwind`                     | True / False            | Required                      | If your app uses TailwindCSS or not.                                   |
| `--eslint`                       | True / False            | Required                      | If your app uses ESLint or not.                                        |
| `--recommended_eslint_config`    | True / False            | Only if `--eslint` is true    | If your app uses Octobox's recommended ESLint configuration or not.    |
| `--stylelint`                    | True / False            | Required                      | If your app uses Stylelint or not.                                     |
| `--recommended_stylelint_config` | True / False            | Only if `--stylelint` is true | If your app uses Octobox's recommended Stylelint configuration or not. |
| `--recommended_windows`          | True / False            | Required                      | Adds top-level `$default` and `$wildcard` Windows automatically.       |
| `--custom_fallbacks`             | True / False            | Required                      | Adds custom pending and error elements automatically.                  |
| `--basename`                     | URI Pathname            | Optional                      | The path your app will be hosted on, or nothing if `/`.                |
| `--unresponsive_ms`              | Number                  | Optional                      | The amount of time the router will wait before loading pending UI.     |
| `--pending_ms`                   | Number                  | Optional                      | The minimum amount of time the router may pend plus unresponsive time. |
| `--max_age_ms`                   | Number                  | Optional                      | The maximum amount of time the router will cache routes and data.      |
