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
npm create octobox-app@latest -- argumented --path $PATH_NAME --tailwind $TRUE_OR_FALSE --eslint $TRUE_OR_FALSE --stylelint $TRUE_OR_FALSE
```

## Experimental Install
If you want to install an unreleased version of Octobox, you can run this command in any terminal other than cmd.exe. Make sure you have git.
```shell
git clone https://github.com/tom-ricci/octobox.git $COMMIT_NAME ; cd ./octobox/create-octobox-app ; npm i ; npm run elevate ; npm run build ; npm run install ; cd ../../ ; npm create octobox-app ; cd ./octobox/create-octobox-app ; npm run clean ; cd ../../ ; npx --yes -p trash-cli trash ./octobox
```
Afterwards, you'll need to remove Octobox's app creator from your trash or recycle bin.

## Testing
To execute unit tests, run the following in any terminal other than cmd.exe. Make sure you have git.
```shell
git clone https://github.com/tom-ricci/octobox.git $COMMIT_NAME ; cd ./octobox/create-octobox-app ; npm i ; npm test ; cd ../../ ; npx --yes -p trash-cli trash ./octobox
```
It's fully self-contained, and will put itself in the trash when complete if you want to see any remaining test files.

> Note:\
> At the time of writing, setting `$COMMIT_NAME` to `-b v2` will clone the latest version.
