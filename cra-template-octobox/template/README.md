# Getting Started
Welcome to your Octobox app! We recommend running one of the scripts below to get started:

### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`
Launches the test runner in the interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can’t go back!**\
Exposes every configuration file of the project. There will be a lot of new files. Run with caution.

### `npm run serve`
Hosts a prebuilt Octobox binary using `serve`.\
You can host a production version of your app using this command.

### `npm run deploy`
Builds and serves your application.\
If you're implementing a CD workflow, use this command.

## Learn More
You can learn more at [Octobox's documentation](https://github.com/tom-ricci/octobox).

## Notes
~~Stylelint currently does not work due it requiring postcss 8 while other dependencies in this framework require postcss 7.~~ This has been fixed! If you're trying to use IDEA's Stylelint integration, however, it will not work. This is a bug with IDEA and will be fixed with 2021.2.4 as per https://youtrack.jetbrains.com/issue/WEB-53225. I'll continue to update this message until all issues with Stylelint are resolved.