# Styling
Octobox supports writing stylesheets with Sass in SCSS. Unlike Sass itself, SCSS is a superset of CSS, so you can write vanilla CSS inside SCSS files if you don't know or want to use Sass. You can also use plain CSS files if needed.

We recommend writing or importing styles in the `/src/styles/main.scss` file, as this is imported into the root of all Octobox apps in the right spot by default.

CSS Modules are also supported via the [Vite CSS module spec](https://v2.vitejs.dev/guide/features.html#css-modules).
