# Routing
Octobox uses a filesystem router built on top of React Location. If you have the patience, we recommend checking out [React Location's documentation](https://react-location.tanstack.com/overview) as well to get a gist of the internals of Octobox's router. It isn't necessary since you probably won't have to touch the internals, but it's nice to have background information.

## Defining Routes
Like Remix, sections of Octobox's routes are nested *inside* one another using outlets. For example, you can check out Remix's demo on the behavior [here](https://remix.run/) (just keep scrolling until you reach the Konami code).

Using this system, Octobox apps feel much more like *apps* rather than just websites. It may be a new pattern you're not used to, but you'll fall in love with it once you get used to it.

With that, Octobox's route components (the actual components that render inside an outlet), are called windows. Each window's source code exists somewhere inside the `/src/windows/` directory. The paths of windows inside this directory define their path on the server. The windows themselves are named Window.tsx, similar to index.html. Windows also have different functions, of which there are 6:

* Static windows
* Dynamic windows
* Wildcard windows
* Default windows
* Pending windows
* Error windows

### Static windows
Static windows are windows whose paths on the server match their paths in the filesystem exactly, just like index.html files. For example:
```
/src/windows/about/Window.tsx -> /about

/src/windows/shop/cart/Window.tsx -> /shop/cart
```

### Dynamic windows
Dynamic windows are windows whose paths consist of variables, or path params. The params can be accessed inside the window via a hook for processing. Dynamic path segments are denoted by a `$` prefix. For example:
```
/src/windows/users/$user/Window.tsx -> /users/alice, /users/bob, /users/carol, etc.

/src/windows/shop/$product/$detail/Window.tsx -> /shop/car/price, /shop/car/specs, /shop/bike/derailleur, /shop/bike/wheel, etc.

/src/windows/admin/$network/settings/$setting/Window.tsx -> /admin/office/settings/firewall, /admin/datacenter/settings/portforwarding, etc.
```

### Wildcard windows
Wildcard windows are like 404 pages; any and all non-static windows at the same path depth or deeper will resolve. When both a dynamic and wildcard window exist in the same directory, the dynamic window will take priority and be resolved instead of the wildcard. Wildcard windows are denoted by a path segment named `$wildcard`. For example:
```
/src/windows/users/$wildcard/Window.txt -> /users, /users/alice, /users/alice/posts, /users/bob/settings, etc.

/src/windows/$wildcard/Window.tsx -> /, /foo, /bar/baz/qux, etc.
```

### Default windows
Default windows are windows which load when the parent window is the deepest window of the current path. They are denoted by `$default`. 

Think about it this way: when `/home` renders, you might want to have a navigation bar and some content. When `/home/about` renders, you still want to keep the navbar but want the homepage content to be swapped out for the about page content. You can solve this by placing your home content inside a default window and rendering an outlet in the navbar's component. 

If you place your content in a default window, it will only load when there is nothing trailing `/home`. Thus, when you're at `/home`, Octobox will render:
```tsx
<HomeNavbar>        /src/windows/home/Window.tsx
  ...              
  <Outlet>         
    <HomeContent/>  /src/windows/home/$default/Window.tsx
  </Outlet>
</HomeNavbar>
```
And when you're at `/home/about`, Octobox will render:
```tsx
<HomeNavbar>         /src/windows/home/Window.tsx
  ...              
  <Outlet>         
    <AboutContent/>  /src/windows/home/about/Window.tsx
  </Outlet>
</HomeNavbar>
```
If you're familiar with layout routes, this produces the same effect, just with a different pattern. Instead of rendering your routes inside a layout route, you render the layout route as a normal route, render your nested routes as normal routes, and specify some default content for when there's no nested routes to render.

### Pending windows
Pending windows are windows that render when another window is loading and the unresponsive timeout has expired. Once the desired window loads, it will replace the currently rendered pending window.

You can use pending windows to create optimistic UI such as spinners. By default, Octobox comes with a global pending window in the form of a spinner. Any pending windows defined in your app override this global window for windows at the same depth or deeper than their location, just like wildcard windows. Pending windows are denoted by a `$pending` path segment. For example:
```
/src/windows/posts/$pending/Window.txt -> /posts, /posts/top, /posts/top/today, /posts/new/today, etc.

/src/windows/$pending/Window.tsx -> /, /foo, /qux/videos, etc.
```

### Error windows
Error windows are similar to pending windows, but they only render when a window fails to load or throws an exception. Octobox contains a global error window. Just like pending windows, any error windows in your app will override this global window for windows at the same depth or deeper than their location. They are denoted by an `$error` path segment.
```
/src/windows/cart/$error/Window.txt -> /cart, /cart/checkout, /cart/checkout/billing, /cart/settings, etc.

/src/windows/$error/Window.tsx -> /, /users, /fourms/home, etc.
```

### Reserved words
You might've noticed that wildcard, default, pending, and error windows all start with a `$`. This means you can't create dynamic windows using `$wildcard`, `$default`, `$pending`, or `$error` anywhere in the window's path. This isn't a problem though, as the names of dynamic path segments are only useful for querying path params, and don't have any effect on user expereince.

You also cannot start static path segments with a `$`. If you need to use a dollar sign in a static window, you can create a dynamic window, write some code in the window to check to see if the current path matches the static path you're looking for, and render the content if so.

Also, while this is not technically a reserved word, it's recommended to avoid nesting dupilcate dynamic routes in one path such as `/$comment/$reply/$reply/$reply/...`. It's technically possible, but may make things a bit wonky. If you need that sort of behavior, it might make more sense using a wildcard window and changing your logic.

## The `<Filesystem/>` Component
The `<Filesystem/>` component is the entry point for routing in your app. It's usually contained inside your `App.tsx` file.

### Props
* `basename`
  * The basename of a filesystem is the path of the root window relative to the origin. For example, if you have an Octobox app at www.example.com, the basename can be undefined. If you have your app hosted at www.example.com/about, set the basename to "about". Basically, if you want to have your routes nested inside another directory in the path, this is where you define that directory.
  * By default, the basename is undefined and your routes will be resolved right at the root of the URL pathname.
* `unresponsiveMs`
  * The unresponsive time is the time between when link is clicked and pending UI is rendered. This is useful when your app is a bit slow. For example, if you expect your windows to take a couple dozen milliseconds to render, you can set this to 100 which will force your pending UI to wait for 100 milliseconds before rendering. If the window loads before the 100 milliseconds have passed, the pending UI will be skipped entirely. You can use this feature to minimize spinners, forcing them to wait so the user only has to see them when something will take a noticably long amount of time.
  * By default, this is set to 500 milliseconds.
  * Set to 0 to disable.
* `pendingMs`
  * This is the minimum amount of time pending UI must be rendered. This is useful to prevent "flashes", or times when pending UI is only rendered for a few milliseconds before a window renders and makes the screen look like it flashed. At best flashes result in bad UX and at worse can confuse the user, so it's recommended to avoid them by forcing pending UI to be rendered long enough for users to figure out what's going on. The time is measured from the click of a link rather than the end of unresponsive time, therefore the actual time your UI will be rendered is *pendingMs - unresponsiveMs*. 
  * By default, this is 1000 milliseconds before subtracting the unresponsive time&mdash;if the unresponsive time is default, the pending UI will be forced to be loaded for 500 milliseconds.
  * Set to 0 to disable.
* `maxAge`
  * The maximum age is the maximum time a window can be loaded for if it's not rendered. Windows can be preloaded and cached so they can load faster when a user navigates to them, and this prop defines how long they can be cached until they must be completely reloaded again. 
  * The default is infinity, which means windows will be cached until the user exits your app.
  * Set to 0 to disable.

## Outlets
Outlets are what windows render inside of. Starting at the root window, each parent window must render an `<Outlet/>` somewhere in the page for the child window to render into. This includes windows with no children besides a default window, as default windows are considered children of the window they belong to and thus are also rendered inside outlets.

Octobox renders outlets like this:
```tsx
<ParentWindow>
  ... // parent window's components
  <Outlet> // parent window's outlet
    <ChildWindow/> // if the child window exists, its rendered right here in the outlet
  </Outlet>
  ... // more of the parent window's components
</ParentWindow>
```

## Window & Data Loading / Unloading
### Window Component
The window component, or the actual TSX contained inside a `Window.tsx` file, should be the default export of said file and be of the type `FC<{}>`. It can be preloaded by anchors, meaning it can be loaded and cached in the background to be rendered ASAP when the user navigates to the window. For example:
```tsx
const Window: FC<{}> = (): ReactElement => {
  return (
    <React.Fragment>
      ...
    </React.Fragment>
  );
};
```

### Data Loading
Data can be loaded for windows in the form of data loaders. Like SSR frameworks, Octobox supports loader functions which can be executed at once to prevent slow loading [waterfalls](https://www.reddit.com/r/reactjs/comments/mriul2/how_to_prevent_waterfall_loading_in_my_react_apps/). They should be exported as named exports called `Loader` of the type `WindowLoader`. For example:
```tsx
export const Loader: WindowLoader = async () => {
  return {...};
};
```
`WindowLoader`s are async functions which take an optional `data` argument and return objects of the type `PermissiveObjectWithMetadata`.

#### Synchronous
Synchronous loaders are data loaders that wait for the loader of their parent window to finish before executing. As a result, they can access the data returned by the parent loader. To tell Octobox a loader is synchronous, add a `data` argument to the function. Also, the function must still be async. For example:
```tsx
export const Loader: WindowLoader = async (data) => {
  return {...};
};
```
Synchronous data loaders are only synchronous relative to the parent, so the parents themselves can be asynchronous. This allows for performance gains in deeply-nested routes where some routes rely on data from their parents and others don't. The ones which don't can simply execute immediately, while the ones which do have to wait.

#### Asynchronous
Asynchronous loaders are data loaders that are executed immediately when a window is loaded. They don't need to wait for any other loaders to execute. They cannot accept data from other loaders, since there's no guarantee the data will be available when they are executed. To tell Octobox a loader is asynchronous, don't add any arguments to the function. For example:
```tsx
export const Loader: WindowLoader = async () => {
  return {...};
};
```

### Data Unloading
Octobox also comes with a data unloading feature. When when the maximum age is reached for a window and it is removed from the cache, Octobox will call that window's data unloader if it exists. This allows data to be unloaded in a custom manner, letting you do any last-minute computations, clean up side effects, etc. They should be named exports of the name `Unloader` and of the type `WindowUnloader`. For example:
```tsx
export const Unloader: WindowUnloader = async () => {
  // ...
};
```
`WindowUnloader`s are void-returning asynchronous functions, and cannot depend on a parent unloader like how synchronous loaders can.

## Metadata Management
Octobox has a system to manage metadata, or the content of the document's `<head/>`. To do this, simply return a `metadata` paramater in a data loader. When the window renders, Octobox will update the document head. The `metadata` key is a reserved key in data loaders, and thus cannot be used to return actual data&mdash;it can only contain metadata. The key is of the type `MetaTags`. Its data also cannot be accessed by synchronous child loaders nor via the `useLoader()` hook.\
For example:
```tsx
export const Loader: WindowLoader = async () => {
  return {
    metadata: {
      title: "Docs Example",
      links: {
        favi: {
          rel: "icon",
          type: "image/x-icon",
          href: "favicon.ico"
        }
      },
      meta: {
        description: {
          name: "description",
          content: "This is a documentation example."
        },
        author: {
          name: "author",
          content: "Thomas Ricci"
        }
      }
    }
  };
};
```

### Types of Metadata
* Title
  * The title is your document title. Only one document title can be returned per metadata object.
* Link
  * Links are pieces of data rendered into HTML `<link/>` components.
* Meta
  * Meta are pieces of data rendered into HTML `<meta/>` components.

### Writing Metadata
Metadata is simple to write. The key of a piece of data defines the name Octobox will identify it by. The key will **not** be passed as a prop to the final compiled HTML tag.

The properties of a piece of data will be passed as props to the final compiled HTML tag. For tags inside the `links` object, they will be passed into `<link/>` tags. For tags inside the `meta` object, they will be passed into `<meta/>` tags.

For example:
```ts
meta: {
  thePublisher: {
    name: "publisher"
    content: "Thomas Ricci"
  }
}
```

Compiles to:
```html
<meta name="publisher" content="Thomas Ricci"/>
```

### Resolution Patterns
Metadata can be returned by multiple loaders, with children overriding parent loaders *even if they are asynchronous*. Octobox determines which metadata tags to override based on their keys.

If a parent loader returns a `link` with the key `favi` and a child loader returns a `link` with the key `favi`, the link from the child loader will override the link from the parent loader. The same goes for meta. Also, titles always override their parents.
> **Note**\
> Link tags and meta tags with the same keys won't override eachother. Only tags returned by children with the same keys and types as tags returned by their parents will be overriden.

For example:
```tsx
// Loader found in /src/windows/Window.tsx (the parent loader)
export const Loader: WindowLoader = async () => {
  return {
    metadata: {
      title: "...", // Since the child has a title, this will be overriden
      links: {
        favi: {...} // Since the child has a link with the key "favi", this will be overriden
      },
      meta: {
        description: {...}, // Since the child has a meta tag with the key "description", this will be overriden
        author: {...} // Since the child doesn't have a meta tag with the key "author", this will not be overriden
      }
    }
  };
};

// Loader found in /src/windows/about/Window.tsx (the child loader)
export const Loader: WindowLoader = async () => {
  return {
    metadata: {
      title: "...", // This overrides the parent's title
      links: {
        favi: {...} // This overrides the parent's "favi" link
      },
      meta: {
        description: {...} // This overrides the parent's "description" meta tag
      }
    }
  };
};
```

## Links & Redirects

### Anchors
Anchors are Octobox's version of `<a/>` tags. 

An anchor will render either an `<a/>` tag or React Location's `<Link/>` tag (which itself renders an `<a/>` tag) based on whether the link is static or not. A static anchor is a link designed to navigate a user to a static HTML page, while a non-static anchor navigates a user to a window. Anchors also tell windows when to be preloaded if at all.

For example:
```tsx
<Anchor to={"profile"} preload={"render"}>
  <ActiveChild className={"..."}>
    <span>Your Profile</span>
  </ActiveChild>
  <InactiveChild className={"..."}>
    <span>Your Profile</span>
  </InactiveChild>
</Anchor>
```

#### Props
* `static`
  * Defines whether or not an anchor is static.
  * Static anchors will always reload the page when clicked.
  * Static anchors will remove the `onClick` prop from the rendered `<a/>` tags because executing Javascript based on a static anchor is pointless; use a non-static anchor to accomplish that.
* `preload`
  * Defines when the linked window should be preloaded, if at all.
  * This prop overrides React Location's `preload` prop.
  * If the anchor is static, this prop will not be accessible.
* `to`
  * The equavilent of an `<a/>`'s `href` attribute.
  * As a result, the `to` prop will override the `href` prop if included.
* Other Props
  * Anchors inherit all of React's default HTML `<a/>` tag props if they are static. Otherwise, they inherit all of React Location's `<Link/>` props besides `preload`, which is overriden by Octobox's `preload` prop.

#### Preloading
Anchors tell windows when to be preloaded via the `preload` prop. When a window is preloaded, it's data loaders are executed and the window's content is prepared in the background and cached. When the window is navigated to, it can now instantly be rendered instead of having to wait to load.

When preloading, the path segments of the anchor's `to` prop will determine which windows preload. For example, if the `to` prop is `"./me/settings"`, `/src/windows/me/Window.tsx` and `/src/windows/me/settings/Window.tsx` will be preloaded since the anchor links to those two windows. If there is no window to load at a certain segment of the path, Octobox will still preload the rest of the windows fine.

Windows can be preloaded at one of two times:
* `"render"`
  * When the anchor is rendered
* `"hover"`
  * When the user hovers over the anchor

To disable preloading, set the prop to `"never"`.

Windows will be unloaded when the router's maximum age has been reached if they haven't been navigated to yet.

#### Stateful Anchors
As you might have noticed, the anchor example at the beginning of this section includes two child components of the `<Anchor/>`: an `<ActiveChild/>` and `<InactiveChild/>`. These add state to anchors, allowing you to, for example, style them differently if you're at the window they link to.

The `<ActiveChild/>` component will render when an anchor is *active*, meaning that the user is currently at the path the anchor links to.

The `<InactiveChild/>` component will do the opposite, rendering when the user is *not* currently at the path the anchor links to.

You can also use the `useAnchorState()` hook in an `<Anchor/>`'s child to programmatically determine whether an anchor is active or not.

### Redirects
Redirects are a programmatic form of anchors. Unlike anchors, they cannot preload windows nor be static. They take React Location's `useNavigate()()` props (that is not a typo, it is actually `()()`), which includes the `to` prop that anchors have.

For example:

```tsx
<RedirectComponent to={"./users"}/>

useRedirect({ to: "./users" });

redirect({ to: "./users" });
```

#### The `<RedirectComponent/>` Component
A component-based redirect. When this component is rendered, it will automatically redirect the user.

#### The `useRedirect()` Hook
A hook-based redirect. When this hook is called, it will automatically redirect the user.

#### The `redirect()` Function
A function-based redirect. When this function is called, it will automatically redirect the user.

## Accessing Data

### Loader Data
Data is returned by loaders via objects of the `PermissiveObjectWithMetadata` type and can be accessed in windows via `useLoader()`. The output from `useLoader()` is untyped, so you'll have to cast your data to the correct types.

For example:
```tsx
const Window: FC<{}> = (): ReactElement => {
  const { name } = useLoader();
  return (
    <React.Fragment>
      <p>My name is { name as string }.</p>
    </React.Fragment>
  );
};

export const Loader: WindowLoader = async () => {
  return { name: "Thomas Ricci" };
};

export default Window;
```

### Path Params
Path params are stored in segments of dynamic paths. For example, given the window `/src/windows/$user/$panel/Window.tsx` and the path `/admin/settings`, your path params will be `user: "admin", panel: "settings"`. You can access this with the `useParams()` hook:
```tsx
const Window: FC<{}> = (): ReactElement => {
  const { user, panel } = useParams();
  return (
    <React.Fragment>
      <p>I am an { user as string } and I'm currently at { panel as string}.</p>
    </React.Fragment>
  );
};

export default Window;
```
Like loader data, the `useParams()` hook also returns untyped data.

### Search Params
Search params can be accessed like path params using the `useSearch()` hook. For example, given the query `?username=bob&password=verysecurepassword`, you'll get `username: "bob", password: "verysecurepassword"`:
```tsx
const Window: FC<Props> = (): ReactElement => {
  const { username, password } = useSearch();
  return (
    <React.Fragment>
      <hr className={"pb-3"}/>
      <p className={"font-mono pb-3"}>/results</p>
      <p className={"pb-3"}>Your username is <code>"{username}"</code> and your password is <code>"{password}"</code>.</p>
    </React.Fragment>
  );
};
```
Like loader data and path params, the `useSearch()` hook also returns untyped data.

## Reloading
You can reload the page programmatically using the `useReload()` hook. Also, static anchors always reload the page.

## Advanced

### Accessing React Location
Octobox's router relies on React Location. You can access React Location and expose its APIs via `import { ReactLocation } from "octobox-utils";`.

### Accessing History
React Location, and as a result Octobox, relies on [history](https://www.npmjs.com/package/history). You can access the router's history instance with `useRoutingInternals().router.rl.location.history`.

### Accessing Internals
Octobox exposes some of its internal APIs in an object returned by the`useRoutingInternals()` hook. Check its type information for documentation on each exposed API.

## IDEA Window Template
Windows come with a simple TSX template for quick bootstrapping on the IntelliJ Platform. Supported IDEs currently include web-development-supported IDEA products including IntelliJ IDEA Ultimate, Fleet, WebStorm, PhpStorm, AppCode, PyCharm, GoLand, Rider, and CLion. To use this template, open your `File and Code Templates` menu and replace your current TSX template with the following:
```velocity
#set($nameOfElement = ${StringUtils.capitalizeFirstLetter(${nameOfElement})})
#set($nameOfElement = ${nameOfElement.split("\.")[0]})
#set($imports = "FC, ReactElement")
import React, { ${imports} } from "react";
import { WindowLoader, WindowUnloader, Outlet } from "octobox-utils";

interface Props {

}

#if($nameOfElement == "Window")
const ${nameOfElement}: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <Outlet/>
    </React.Fragment>
  );
};

export const Loader: WindowLoader = async () => {
  return { metadata: {} };
};

export const Unloader: WindowUnloader = async () => {};

export default Window;
```

## Known Bugs & Issues

### Editing Source Code
When a window's source file changes, Octobox's router fails to operate. This can be fixed by reloading the page. This is only a problem in development, and the router will operate correctly in production. This is a [known bug](https://github.com/TanStack/location/issues/221) in React Location. We are planning on implementing an optional file watcher which reloads the page every time a change occurs or every time a navigation attempt occurs after editing a source file.

### Error Components
When a data loader fails, Octobox doesn't load an error window and tries to continue to load the intended window anyway. This is a [known bug](https://github.com/TanStack/location/issues/255) in React Location and a fix [is on the way](https://github.com/TanStack/location/pull/290). Depending on the timeline of this fix, we might just fork React Location and fix it manually&mdash;although that doesn't mean the source bug will be fixed.
