# Octobox
### Stop scaffolding. Start building.
Octobox is a configuration-less Typescript framework for building React apps. Forget having to spend time configuring linters, CSS frameworks, routing, SEO, and more with Octobox. Just run `npx create-octobox-app@latest`, answer a few questions, and let Octobox take care of the rest for you.

# Features
* Client-side filesystem routing
* Server-side static routing
* Page transition animations
* Tailwind CSS
* Sass
* Miscellaneous hooks
* GitHub Pages support
* ESLint and Stylelint support
* Optional ESLint and Stylelint configs
* SEO
* A great CLI
* No configuration needed

# Setup
To create an Octobox app, run `npx create-octobox-app@latest`.
> Occasionally, Windows users may experience JScript errors trying to run Octobox's npx scripts. To fix this, reassign your .js file association from JScript *(Damn you IE!)* to Node.js

# Updating
Run `npx update-octobox-app@latest` in the root directory of your application to update Octobox to the latest version.

# Usage

### Routing

#### Static (Server-Side) Routing
Simply place your static HTML files inside `public`. That's it.

#### Dynamic (Client-Side) Routing
Components in the `src/pages` directory are associated with paths based on their name and location. Only default exports are used.

Files named `Index.tsx` or `Index.jsx` inside a directory will load similar to `index.html` files, with the route being the route of the directory.

Files sorrounded in brackets will load dynamically, and spread operators will load as wildcards.

For example:
* ./ = src/pages/Index.tsx
* ./about = src/pages/about/Index.tsx
* ./posts/:post = src/pages/posts/[post].tsx
* ./users/* = src/pages/users/[...profiles].tsx

Since Octobox uses React Router v6 under the hood, you can find more documentation on Octobox's routing system [on their website](https://reactrouter.com/docs/en/v6).

To animate transitions between dynamic routes, you can use Framer Motion's motion component. Simply prepend `motion.` to the top level element of pages with the correct props to animate the element.

To learn more about the transition system, visit [Framer Motion's documentation](https://www.framer.com/motion/).

#### Route Conflicts
When a static route and dynamic route share the same name, the conflict will be resolved in one of two ways.
1. If the user came from a static route or no route at all, the static route will load.
2. If the user came from a dynamic route, the dynamic route will load unless a page reload occoured.

#### Switching To Static Routes
If a user is traveling to a static route from a dynamic route, a page reload must occour. If no reload occours, Octobox will attempt to route the user to a dynamic route when the user should be routed to a static route.

#### 404 Behavior
On dynamic routes, users will simply be greeted with `src/NotFound.tsx`. On static routes, users will be sent to `public/404.html`, which will then fallthrough to `src/NotFound.tsx`.

At the end of the day, users will always end up at `src/NotFound.tsx`, but may take different ways to get there.

### Styles
Tailwind and Sass are both preconfigured and imported, so no setup is necessary. Simply use classes in your JSX.
> Tailwind, by default, is configured to enable Dark Mode based on classes. You can change this in `src/tailwind.config.js`

### SEO
Octobox's CLI creates meta tags and handles simple SEO for you based on your input. However, this section explains ways to optimize further if you need to.

#### Using Sitemaps
Due to the way Octobox handles routing, web crawlers may not crawl all of the app's routes. Because of this, you need to specify each dynamic route in `public/sitemap.txt` with the route being a query string for web crawlers to index your client-side routes.

For example:
* ./about = ./?/about
* ./shop/checkout = ./?/shop/checkout

Octobox generates a simple sitemap for you, allowing you to never have to touch the sitemap if you don't want to. If you don't edit the sitemap, however, crawlers may not index all of your pages.

#### Static Homepage Content
Sometimes you may want a statically rendered homepage for SEO purposes. While Octobox isn't designed to build a static index *yet*, we recommend adding some content to `public/index.html` and using query selectors to remove their nodes from the DOM once the app's JS loads. This way, crawlers will still have a static homepage to work with while also not negatively affecting your UX.

### Building
Simply run `npm run build` to build your app.

### Hosting

#### Using `serve`
The easiest way to host an Octobox app is to let it host itself. Run `npm run deploy` to build and host your app with `serve`. If you already have a prebuilt binary of your app, you can just run `npm run serve`.

#### On GitHub Pages
To host your app on GitHub Pages, save the artifacts of `npm run build` to the root of your site.

#### On Other Hosts
As long as your host resolves routes statically and returns 404.html when no static route is found (like GitHub Pages), you can host an Octobox app however you would any other website.

### Final Notes
Thanks for choosing Octobox! If you have any questions, either [send me an email](mailto:me@thomasricci.dev) or get in touch another way. This documentation will be improved Soon™, but for now this is the extent of it. As Octobox is still in relatively early stages of development, expect things to change. Happy hacking!

* [View 1.0.0 Docs](old/archive/1.0.0.README.md)
