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

## Experimental Install
If you want to install an unreleased version of Octobox, you can run this command in any terminal other than cmd.exe. Make sure you have git. You'll need to remove Octobox's installer from your trash or recycle bin afterwards.
```shell
git clone https://github.com/tom-ricci/octobox.git $COMMIT_NAME ; cd ./octobox/create-octobox-app ; npm i ; npm run elevate ; npm run build ; npm run install ; cd ../../ ; npm create octobox-app ; cd ./octobox/create-octobox-app ; npm run uninstall ; cd ../../ ; npx --yes -p trash-cli trash ./octobox
```
Keep in mind that this will not install unreleased versions of Octobox's packages, (I.e. `eslint-config-octobox`) but the newest version on the registry. If you need an unreleased version of an Octobox package, link the package manually.

## Testing
To execute unit tests, run the following in any terminal other than cmd.exe. Make sure you have git.
```shell
git clone https://github.com/tom-ricci/octobox.git $COMMIT_NAME ; cd ./octobox/create-octobox-app ; npm i ; npm test ; cd ../../ ; npx --yes -p trash-cli trash ./octobox
```
It's fully self-contained, and will put itself in the trash when complete if you want to see any remaining test files.

> Note:\
> At the time of writing, setting `$COMMIT_NAME` to `-b v2` will clone the latest version.

## Contributing
To contribute to Octobox, clone the repo and install the dependencies. Then, work on any package. When you're done, run `npm run uninstall` inside `create-octobox-app`.

> Note:\
> Make sure to use the `internal` argument in app or unit test development. For example:
> ```shell
> npm create octobox-app@latest -- argumented internal ... your flags
> ```
> Use this regardless of whether you're using `argumented` or not.