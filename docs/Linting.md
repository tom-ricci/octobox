# Linting
Octobox supports ESLint and Stylelint.

## Install
When you bootstrap an Octobox app, you will be prompted to enable ESLint and Stylelint as well as Octobox's recommend ESLint and Stylelint configs. Choose yes for the linters and configs you want to install.

## Usage
When you have an erronerous file, Octobox will throw an error on the development server which will be visible both in the console and in the app you're building itself.

There's nothing proprietary about Octobox's implementation of linters, so IDE plugins for ESLint and Stylelint should function properly.

## Known Bugs
Linters occasionally break and continue to report there being an error after it was fixed. To work around this, stop the development server and edit and save your file. Then restart the development server. Once everything is running smoothly again, you can undo your changes to the file. We don't know why this happens, but research into this issue and a fix is planned.
