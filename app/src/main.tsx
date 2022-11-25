import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/main.scss";
import { App } from "./App";

for(const elem of document.head.querySelectorAll("[react=true]")) elem.setAttribute("prerender", "true");
(document.body.children[0] as HTMLElement).style.display = "block";
document.getElementById("root")?.children[0].remove();
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(<div><React.StrictMode><App/></React.StrictMode></div>);
