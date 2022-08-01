# octobox-docs
Octobox's documentation.

# Install
> **Note**\
> Currently, this command will install Octobox v1, not v2 as it's not released yet. To use v2, read [#development](#development).

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
| `--routing`                      | True / False            | Required                      | If your app uses Octobox's router or not.                              |
| `--recommended_windows`          | True / False            | Only if `--routing` is true   | Adds top-level `$default` and `$wildcard` Windows automatically.       |
| `--custom_fallbacks`             | True / False            | Only if `--routing` is true   | Adds custom pending and error elements automatically.                  |
| `--basename`                     | URI Pathname            | Optional                      | The path your app will be hosted on, or nothing if `/`.                |
| `--unresponsive_ms`              | Number                  | Optional                      | The amount of time the router will wait before loading pending UI.     |
| `--pending_ms`                   | Number                  | Optional                      | The minimum amount of time the router may pend plus unresponsive time. |
| `--max_age_ms`                   | Number                  | Optional                      | The maximum amount of time the router will cache routes and data.      |

# Usage

// TODO: this

# Development

## Requirements
Octobox requires Node 16 and npm 8. Its commands support Bash and Powershell, and they *should* also run fine on zsh or other \*nix terminals.

## Local Install
If you want create an Octobox app locally, run the `start` npm script after cloning the Octobox repo. You can also run `dev` in `/create-octobox-app` for the same effect.
### Using Arguments
To use arguments, first run `npm run dev-install` inside `./create-octobox-app`. Then run `npm create octobox-app@latest -- internal argumented $ARGS`, filling in `$ARGS` with your arguments as defined by [#arguments](#arguments).

## Environment
You can (re)install Octobox into your local environment by running `npm run dev-install` and uninstall it with `npm run dev-uninstall`.

## Contributing
All of Octobox's development scripts are stored inside the installer's directory, `/create-octobox-app`. Assume every script and path below is relative to that directory.

### Writing
When you write code for Octobox, make sure to lint your app using the ESLint configurations provided.

### Building
To build Octobox's installer, run the `build` npm script.

### Testing
#### Writing
To write unit tests, head over into `./test/`. Find the highest numbered test, and create a file numbered one higher. Tests are written in JavaScript, not TypeScript. Then find the `await utils.finish(index);` call and replace it with `await utils.run(yourtestfile, indexofyourtestfile);`. Follow the patterns of other tests as a guide. At the end of your test, call `await utils.finish(index);`.\
Make sure to use the `internal` argument whenever you run `npm create octobox-app` in tests. This tells Octobox to *link* any Octobox packages being depended on rather than *install* them, so the currently installed local copy of Octobox will be tested.

Also, if you add any new arguments to Octobox's installer, add them to the first argument of the second `execSync` call in `./test/two.test.js`. Also add these arguments to apps in `./test/hashes.json` following the pattern defined in the schema. If you don't know the checksum of an app, you can leave it blank. It will be filled in when you recompute the hashes.
#### Running
To execute unit tests, run the `test` npm script. It's fully self-contained, and will delete all test artifacts.\
The first unit test compares Octobox apps against checksums stored in `./test/hashes.json`. To recompute these checksums, run `test-create`. To skip this test since it's quite slow, run `test-skip-checksum`.

Octobox will reinstall itself locally when you run tests, so you'll always be testing the version of Octobox you just wrote.
