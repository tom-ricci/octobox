# create-octobox-app
Octobox's app creation CLI.

## Install
You can use the default setup, which will bring you through a list of setup prompts to create your app.
```shell
npm create octobox-app@latest
```
> **Note**\
> On Windows, you may need to reassign your `.js` file association from JScript to Node.js

You can also pass arguments to the command instead of using prompts, if you want. If you're using arguments, you must include all required ones.
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
| `--recommended_windows`          | True / False            | Optional                      | Adds top-level `$default` and `$wildcard` Windows automatically.       |
| `--custom_fallbacks`             | True / False            | Only if `--routing` is true   | Adds custom pending and error elements automatically.                  |
| `--basename`                     | URI Pathname            | Optional                      | The path your app will be hosted on, or nothing if `/`.                |
| `--unresponsive_ms`              | Number                  | Optional                      | The amount of time the router will wait before loading pending UI.     |
| `--pending_ms`                   | Number                  | Optional                      | The minimum amount of time the router may pend plus unresponsive time. |
| `--max_age`                      | Number                  | Optional                      | The maximum amount of time the router will cache routes and data.      |

## Development

### Local Install
If you want to install a local copy of Octobox, just run this command in the parent directory of your app. Alternatively, you can run the `dev` npm script if you've already cloned the Octobox repo.
```shell
git clone https://github.com/tom-ricci/octobox.git $COMMIT_NAME ; cd ./octobox/create-octobox-app ; npm i ; npm run dev ; cd ../../
```

### Testing
To execute unit tests, run the following. If you want to run unit tests on a local clone of the Octobox repo, you can run the `test` npm script.
```shell
git clone https://github.com/tom-ricci/octobox.git $COMMIT_NAME ; cd ./octobox/create-octobox-app ; npm i ; npm test ; cd ../../ ; npx --yes rimraf ./octobox
```
It's fully self-contained, and will delete all test artifacts (including the repo if you're using the command above).

### Useful Info
* You can install Octobox and its dependencies locally using `npm run dev-install` if for whatever reason they're uninstalled, overwritten, etc.
* You can clean up your environment with `npm run dev-uninstall`.
* At the time of writing, setting `$COMMIT_NAME` to `-b v2` will clone the latest version when installing locally. For example, in Bash:
```shell
 export COMMIT_NAME="-b v2"
```
* Octobox requires git, Node 16, npm 8, and supports Bash and Powershell. It *should* also run fine on zsh or other \*nix terminals.
* Make sure to use the `internal` argument in app or unit test development. This tells Octobox to *link* any Octobox packages being depended on rather than *install* them. This allows you to use local copies of Octobox's packages rather than the published ones on npm, which may be useful for a variety of reasons. You will need to have Ocobox's packages locally linked for this to work, but Octobox takes care of that for you before executing tests and when you execute `npm run dev-install`.\
For example:
```shell
npm create octobox-app@latest -- internal $ARGS
```
