# Development

## Requirements
Octobox requires Node 16 and npm 8. Its commands support Bash and Powershell, and they *should* also run fine on zsh or other \*nix terminals.

## Local Install
If you want create an Octobox app locally, run the `start` npm script after cloning the Octobox repo. You can also run `dev` in `/create-octobox-app` for the same effect.
### Using Arguments
To use arguments, first run `npm run dev-install` inside `./create-octobox-app`. Then run `npm create octobox-app@latest -- internal argumented $ARGS`, filling in `$ARGS` with your arguments as defined by [this](https://github.com/tom-ricci/octobox/blob/main/docs/Install.md#arguments).

## Contributing
All of Octobox's development scripts are stored inside the installer's directory, `/create-octobox-app`. Assume every script and path below is relative to that directory.

### Environment
You can (re)install Octobox into your local environment by running `npm run dev-install` and uninstall it with `npm run dev-uninstall`. Octobox will also build its installer and compilier when installing.

### Writing
When you write code for Octobox, make sure to lint your app using the ESLint configurations provided.

### Building
To build Octobox's buildable packages, run the `build` npm script. It will build the Octobox installer and Octobox compilier.

### Testing
#### Writing
To write unit tests, head over into `./test/`. Find the highest numbered test, open it, and create a file numbered one higher. Tests are written in JavaScript, not TypeScript. Then find the `await utils.finish(index);` call in the test you opened and replace it with `await utils.run(yourtestfile, indexofyourtestfile);`. Follow the patterns of other tests as a guide. At the end of your new test, call `await utils.finish(index);`.\
Make sure to use the `internal` argument whenever you run `npm create octobox-app` in tests. This tells Octobox to *link* any Octobox packages being depended on rather than *install* them, so the currently installed local copy of Octobox will be tested.

Also, if you add any new arguments to Octobox's installer, add them to the first argument of the second `execSync` call in `./test/two.test.js`. Also add these arguments to apps in `./test/hashes.json` following the pattern defined in the schema. If you don't know the checksum of an app, you can leave it blank. It will be filled in when you recompute the hashes.
#### Running
To execute unit tests, run the `test` npm script. It's fully self-contained, and will delete all test artifacts.\
The first unit test compares Octobox apps against checksums stored in `./test/hashes.json`. To recompute these checksums, run `test-create`. To skip this test since it's quite slow, run `test-skip-checksum`.

Octobox will reinstall itself locally when you run tests, so you'll always be testing the version of Octobox you just wrote.
