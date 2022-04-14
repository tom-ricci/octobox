# create-octobox-app
Octobox's app creation CLI.

## Install
You can use the default setup, which will bring you through a list of setup prompts to create your app.
```shell
npm create octobox-app@latest
```
> Note:\
> On Windows, you may need to reassign your `.js` file association from JScript to Node.js

You can also pass arguments to the command instead of using prompts, if you want. Replace each `$VARIABLE` with your input. All flags and their respective values must exist.
```shell
npm create octobox-app@latest -- argumented --path $PATH_NAME --tailwind $TRUE_OR_FALSE --eslint $TRUE_OR_FALSE --recommended_eslint_config $TRUE_OR_FALSE --stylelint $TRUE_OR_FALSE --recommended_stylelint_config $TRUE_OR_FALSE
```

## Development

### Local Install
If you want to install a local copy of Octobox, just run this command in the parent directory of your app. Alternatively, you can just run the `dev` npm script.
```shell
git clone https://github.com/tom-ricci/octobox.git $COMMIT_NAME ; cd ./octobox/create-octobox-app ; npm i ; npm run dev
```

### Testing
To execute unit tests, run the following in any terminal other than cmd.exe. You need git.
```shell
git clone https://github.com/tom-ricci/octobox.git $COMMIT_NAME ; cd ./octobox/create-octobox-app ; npm i ; npm test ; cd ../../ ; npx --yes rimraf ./octobox
```
It's fully self-contained, and will not leave any artifacts afterwards.

### Useful Info
Make sure to use the `internal` argument in app or unit test development. For example:
```shell
npm create octobox-app@latest -- internal $ARGS
```

You can clean up your environment with `npm run uninstall`.

At the time of writing, setting `$COMMIT_NAME` to `-b v2` will clone the latest version.