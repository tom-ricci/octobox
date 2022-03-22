# create-octobox-app
Octobox's app creation CLI.
## Usage:
You can use the default setup, which will bring you through a list of setup prompts to create your app.
```shell
npm create octobox-app@latest
```
You can also pass arguments to the command instead of using prompts, if you want. Replace each `$VARIABLE` with your input.
```shell
npm create octobox-app@latest -- argumented --path $PATH_NAME
```
> Note:\
> You MUST include the space between the first `--` and `argumented`. They are meant to be two seperate arguments.

## Testing
You can run create-octobox-app's tests by running `npm test` after cloning the repo and running `npm i`.