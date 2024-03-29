# Prerendering
Prerendering allows your app to be indexable by crawlers without JavaScript support by loading windows at compile time and serving the HTML/CSS first, then loading the React app if JavaScript is enabled. Octobox also deletes the prerendered DOM and creates a new Virtual DOM on every page load (assuming JavaScript is enabled) to avoid hydration errors. Regardless of the search engine, your app will show its best content to crawlers.

## Advisory
Octobox uses the words *compile* and *prerender* interchangeably since Octobox's compilier and prerenderer are so closely related. When you see either one being used in the context of Octobox, know that they refer to the same thing.

## How It Works
When you build your app, Octobox's compilier will transpile and bundle the app with Vite and then preview the Vite build. Your app will automatically detect that it's being previewed by the Octobox compilier and supply a list of your windows to the compilier. The compilier will filter out any ineligible or disabled windows from the list and then convert the remaining windows into paths it can navigate to. It will finally serve your app on localhost, visit each path, wait for the page to load, take a snapshot of the page, and save that snapshot as an HTML file in the final build.

## Usage
Windows must include a `CompilierConfig` with the name `Config` in their source code to be prerendered. Any non-wildcard windows generated by Octobox's installer will already have a configuration. Wildcard windows cannot be prerendered.

For example:
```typescript
export const Config: CompilierConfig = {
  compile: true,
  type: "static"
};
```

### Compiling Static Windows
To compile a static window, simply use the following configuration:
```typescript
export const Config: CompilierConfig = {
  compile: true,
  type: "static"
};
```

### Compiling Dynamic Windows
To compile a dynamic window, use the following configuration. Note that you also must include at least one [path param](https://github.com/tom-ricci/octobox/blob/main/docs/Routing.md#path-params) to compile.
```typescript
export const Config: CompilierConfig = {
  compile: true,
  params: [...],
  type: "dynamic"
};
```
> **Note**\
> Path params compile to directories in the final build.\
> For example, if you had the window `/src/windows/$user/Window.tsx`, and the params `["thomas", "admin"]`, the compilier would prerender `http://localhost/thomas` and `http://localhost/admin`. Your final build would include `/thomas/index.html` and `/admin/index.html`.

### Explicitly Disabling Compilation
Octobox won't compile a window if it doesn't have a config, but if you want to explicitly disable compilation of a window you can do so with the following:
```typescript
export const Config: CompilierConfig = {
  compile: false
};
```

### Global Configuration
Octobox has multiple options for compiled HTML files in the final build. These options are specified in the `package.json` `"compile"` property. It has the following type signature:
```
compile = { 
  index?: "root" | "all",
  404?: "root" | "all",
  200?: "root" | "all"
}
```
> **Note**\
> By default, it will be defined as the following:
> ```json
> {
>  "compile": {
>    "index": "all",
>    "404": "all"
>  }
> }
> ```
> This is the best configuration for most apps. With this config, all compiled windows will be saved to both an `index.html` file and `404.html` file.

#### **Definitions**
* `index`
  * Represents `index.html` files.
  * Values
    * `"root"`
      * When specified, an `index.html` file will only be generated for the root window. If the root window has compilation disabled, no `index.html` files will be generated at all.
    * `"all"`
      * When specified, an `index.html` file will be generated for every compiled window in the app.
* `404`
    * Represents `404.html` files.
    * Values
        * `"root"`
            * When specified, a `404.html` file will only be generated for the root window. If the root window has compilation disabled, no `404.html` files will be generated at all.
        * `"all"`
            * When specified, a `404.html` file will be generated for every compiled window in the app.
* `200`
    * Represents `200.html` files.
    * Values
        * `"root"`
            * When specified, a `200.html` file will only be generated for the root window. If the root window has compilation disabled, no `200.html` files will be generated at all.
        * `"all"`
            * When specified, a `200.html` file will be generated for every compiled window in the app.
> **Note**\
> Configuration entires will not override one another.
> 
> For example, given the following, every compiled route will save to all three types of files: `index.html`, `404.html`, and `200.html`.
> ```json
> {
>  "compile": {
>    "index": "all",
>    "404": "all",
>    "200": "all"
>  }
> }
> ```

## Caveats
The Octobox compilier does not support redirects. If a window redirects the user automatically, there is no guarantee that window's compiled HTML will be correct. If a window which contains a redirect has to be compiled, the redirect must be triggered by user input such as a form submission.

If a compiled window has the same name or is located in the same directory as a file built by Vite (besides the top-level Vite `index.html` file) it will be overwritten by the Vite file.

The top-level `index.html` file generated by Vite will be deleted as it is meant to be replaced with the top level `index.html` file generated via prerendering.

## Reserved Words
You cannot use the string `"jtbuksxfmarnecqwldhigvpyo"` in `<meta>` tag attributes, dynamic path params in `CompilierConfig`s, or session storage keys because it is used internally by the Octobox compilier.

You cannot create an element in the DOM which can be selected via `#root[data-jtbuksxfmarnecqwldhigvpyo-pn]` because an element with that selector is managed internally by the Octobox compilier.