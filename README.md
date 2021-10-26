# @tom-ricci/cra-template
An opinionated TypeScript template with Tailwind, filesystem routing, and page animations out of the box.

# Features
* Tailwind CSS
* Filesystem routing with React Router
* Page transition animations with Framer Motion
* Preconfigured directories
* No configuration needed
# Install
To use this template, add `--template @tom-ricci` when creating a new app.

For example:

```sh
npx create-react-app my-app --template @tom-ricci

# or

yarn create react-app my-app --template @tom-ricci
```
# Usage
Tailwind is preconfigured and imported, to use it all you need to do is add CSS classes to components. It's set up to use Dark Mode via classes.

The routing solution is simple. Components in the `src/pages` directory are associated with paths based on their name and location. Files named `Index.tsx` or `Index.jsx` inside a directory will load similar to `index.html` files. Files sorrounded in brackets will load dynamically, and spread operators will load as wildcards. Anything which returns a 404 will render `NotFound.tsx` For example:
* src/pages/Index.tsx => ./
* src/pages/about/Index.tsx => ./about
* src/pages/posts/[post].tsx => ./posts/:post
* src/pages/users/[...profiles] => ./users/*
* src/NotFound.jsx => ./somenonexistentpath

Page transitions are also simple. You can use Framer Motion's motion component to animate. Pages are wrapped in AnimatePresence, so you can animate an element's class using normal Framer Motion syntax.

The directories found in `src/` are generally simple to understand. `hooks/` is for React Hooks, `pages/` is for pages to be rendered, `static/` is for static files, and `styles/` is for custom CSS styles, with main.css being already imported.

While no configuration is needed as it is all generated for you, you can edit said configurations to fit your needs.

