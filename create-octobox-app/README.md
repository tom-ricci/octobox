# create-octobox-app
Octobox's app creation CLI.
## Usage:
You can use the default setup, which will bring you through a list of setup prompts to create your app.
```shell
npm create octobox-app@latest
```
> Note:\
> On Windows, you may need to reassign your `.js` file association from JScript to Node.js

You can also pass arguments to the command instead of using prompts, if you want. Replace each `$VARIABLE` with your input.
```shell
npm create octobox-app@latest -- argumented --path $PATH_NAME
```

## Testing
To execute unit tests, make sure you have at least Node 16, npm 8, and git. Then, using any terminal besides cmd.exe, run `git clone https://github.com/tom-ricci/octobox.git -b v2 ; cd ./octobox/create-octobox-app ; npm i ; npm test ; cd ../../ ; npx --yes -p trash-cli trash ./octobox`. It's fully self-contained, and will put itself in the trash when complete.
