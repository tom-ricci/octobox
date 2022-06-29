import React, { FC, ReactElement } from "react";
import { Outlet } from "@tanstack/react-location";
import { Spacer } from "octobox-utils";
import { Anchor } from "../../components/routing/api/Anchor";
import { Preload } from "../../components/routing/api/Preload";
import { ActiveChild, InactiveChild } from "../../components/routing/api/AnchorChildren";
import { MetaTags } from "../../components/routing/api/MetaTags";
import { WindowLoader } from "../../components/routing/api/Loaders";

interface Props {

}

const Window: FC<Props> = (): ReactElement => {
  return (
    <React.Fragment>
      <div className={"p-5"}>
        <Spacer height={"2rem"}/>
        <h2 className={"text-5xl"}>Routing</h2>
        <Spacer height={"1rem"}/>
        <hr/>
        <Spacer height={"1rem"}/>
        <p className={"pb-4"}>Routing is at the core of Octobox. With a super simple implementation, data handling, code-splitting, meta handling, and more, Octobox has you covered.</p>
        <p className={"pb-4"}>Octobox uses a filesystem router, meaning all you'll ever need to do is add your page components. You <em>never have to deal</em> with a route config. Unlike other filesystem routers such as Next.js, Octobox uses a path-based system similar to HTML. Every route is an actual path in your app, with a <code className={"bg-gray-800 rounded text-white px-1.5 py-0.5"}>Window.tsx</code> file as your page component. No more dealing with <code className={"bg-gray-800 rounded text-white px-1.5 py-0.5"}>index.js</code> resolving to / and <code className={"bg-gray-800 rounded text-white px-1.5 py-0.5"}>about.js</code> resolving to /about while <code className={"bg-gray-800 rounded text-white px-1.5 py-0.5"}>/products/index.js</code> resolves to /products. Data loaders and mutators exist too, just like Remix and other SSR frameworks. Meta? Just define it in your components and let Octobox prerender and hotload them. Your SEO'll thank you. Code-splitting is a breeze with Octobox too. Your app's page components, or windows—where you usually write the most code—are split automatically and smartly prefetched to increase performance, lower your time to first meaningful paint, and minimize spinners.</p>
        <p className={"pb-4"}>Oh, and did we mention this is all client-side and can be hosted anywhere?</p>
        <div className={"rounded-xl border-2 border-gray-300"}>
          <div className={"border-b-2 p-1 text-center border-gray-300"}>
            <h2>Routing Demo</h2>
          </div>
          <div className={"flex flex-row"}>
            <div className={"p-3"}>
              <Anchor to={"./"} className={"font-mono block text-fuchsia-600 pb-1"}>/</Anchor>
              <Anchor to={"render"} preload={Preload.RENDER} className={"font-mono block text-fuchsia-600 pb-1"}>/render</Anchor>
              <Anchor to={"hover"} preload={Preload.HOVER} className={"font-mono block text-fuchsia-600 pb-1"}>/hover</Anchor>
              <Anchor to={"never"} preload={Preload.NEVER} className={"font-mono block text-fuchsia-600 pb-1"}>/never</Anchor>
              <Anchor to={"nested/octotest"} preload={Preload.HOVER} className={"font-mono block text-fuchsia-600 pb-1"}>/nested/:variable</Anchor>
              <Anchor to={"nested/sync"} preload={Preload.RENDER} className={"font-mono block text-fuchsia-600 pb-1"}>/nested/sync</Anchor>
              <Anchor to={"expensive"} preload={Preload.NEVER} className={"font-mono block text-fuchsia-600 pb-1"}>/expensive</Anchor>
              <Anchor to={"stateful"} preload={Preload.HOVER} className={"font-mono block text-fuchsia-600 pb-1"}>
                <ActiveChild>
                  <span className={"text-white bg-fuchsia-500 rounded px-1"}>/stateful</span>
                </ActiveChild>
                <InactiveChild>
                  <span>/stateful</span>
                </InactiveChild>
              </Anchor>
              <Anchor to={"redirect"} preload={Preload.RENDER} className={"font-mono block text-fuchsia-600 pb-1"}>/redirect</Anchor>
              <Anchor to={"meta"} preload={Preload.RENDER} className={"font-mono block text-fuchsia-600 pb-1"}>/meta</Anchor>
              <Anchor to={"notfound"} preload={Preload.RENDER} className={"font-mono block text-fuchsia-600 pb-1"}>/notfound</Anchor>
              <Anchor to={"error"} preload={Preload.RENDER} className={"font-mono block text-fuchsia-600 pb-1"}>/error</Anchor>
            </div>
            <div className={"flex-grow border-l-2 border-gray-300 p-3"}>
              <Outlet/>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export const Loader: WindowLoader = async () => {
  return {
    metadata: {
      title: "title2",
      links: {
        foo: {
          href: "https://twitter.com"
        },
        bar: {
          href: "https://facebook.com"
        },
        qux: {
          href: "https://instagram.com"
        }
      },
      meta: {
        foo: {
          name: "description",
          content: "an even cooler description"
        },
        bar: {
          name: "author",
          content: "you"
        },
        qux: {
          name: "publisher",
          content: "quackers"
        }
      }
    }
  };
};

export default Window;
