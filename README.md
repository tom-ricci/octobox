# Octobox
An opinionated TypeScript template with Tailwind, filesystem routing, and page animations out of the box.

# Features
* Tailwind CSS
* Dynamic filesystem routing with React Router
* Page transition animations with Framer Motion
* Static filesystem routing
* GitHub Pages support
* No configuration needed
* 
# Install
To use this template, add `--template @tom-ricci` when creating a new app.

For example:

```sh
npx create-react-app my-app --template @tom-ricci

# or

yarn create react-app my-app --template @tom-ricci
```
# Usage
### Styles
Tailwind is preconfigured and imported, to use it all you need to do is add CSS classes to components. It's set up to use Dark Mode via classes. To build Sass, use `npm run buildsass`. To daemonize this process, use `npm run sass`. The Sass daemon is initalized on startup so you don't have to use this if you run the development server, though.

### Routing

#### Static Routing
Simply place your static HTML files inside `/public`. Since GitHub Pages supports static routing by default, nothing is required to make this work. 

Static routes will be preferred over dynamic routes, so if a static route and dynamic route are the same, the static content will load instead of the dynamic content.

#### Dynamic Routing
Components in the `src/pages` directory are associated with paths based on their name and location. Only default exports are used.

Files named `Index.tsx` or `Index.jsx` inside a directory will load similar to `index.html` files, with the route being the route of the directory.

Files sorrounded in brackets will load dynamically, and spread operators will load as wildcards. Anything which returns a 404 will render `NotFound.tsx`.

For example:
* ./ => src/pages/Index.tsx
* src/pages/about/Index.tsx => ./about
* ./posts/:post => src/pages/posts/[post].tsx
* ./users/* => src/pages/users/[...profiles]
* ./somenonexistentpath => src/NotFound.jsx

To transition between dynamic routes, you can use Framer Motion's motion component. Simply prepend `motion.` to the top level element of pages with the correct props to animate the element.

### SEO
Since GitHub pages doesn't natively support dynamically routed SPAs, Octobox has to redirect users from the 404 page when they attempt to navigate to a dynamic page if they're not already on another dynamic page. While this does mean GitHub Pages can host this app, it also means web crawlers may not crawl all of the app's routes. Because of this, you need to specify each route in `public/sitemap.txt` with the route being a query string for web crawlers to work. 

For example:
* ./about => ./?/about
* ./shop/checkout => ./?/shop/checkout
