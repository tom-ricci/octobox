import React, { FC, ReactElement, useContext } from "react";
import { Outlet } from "@tanstack/react-location";
import { Spacer } from "octobox-utils";
import { Anchor, AnchorContext, Preload } from "../../components/routing/api/Anchor";
import { AnchorState, useAnchorState } from "../../components/routing/api/AnchorState";

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
              <Anchor to={"never"} preload={Preload.NEVER} className={"font-mono block text-fuchsia-600 pb-1"}>
                <AnchorState>
                  {state => {
                    return state ? <span className={"text-blue-500"}>/never</span> : <span>/never</span>;
                  }}
                </AnchorState>
              </Anchor>
              <Anchor to={"nested/octotest"} preload={Preload.HOVER} className={"font-mono block text-fuchsia-600 pb-1"}>/nested/:variable</Anchor>
              <Anchor to={"nested/sync"} preload={Preload.RENDER} className={"font-mono block text-fuchsia-600 pb-1"}>/nested/child</Anchor>
              <Anchor to={"expensive"} preload={Preload.NEVER} className={"font-mono block text-fuchsia-600 pb-1"}>/expensive</Anchor>
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

export default Window;
