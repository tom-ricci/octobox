#!/usr/bin/env node
"use strict";var __awaiter=this&&this.__awaiter||function(e,i,t,o){return new(t||(t=Promise))((function(n,s){function l(e){try{r(o.next(e))}catch(e){s(e)}}function c(e){try{r(o.throw(e))}catch(e){s(e)}}function r(e){var i;e.done?n(e.value):(i=e.value,i instanceof t?i:new t((function(e){e(i)}))).then(l,c)}r((o=o.apply(e,i||[])).next())}))};const{createServer:createServer,build:build}=require("vite"),puppeteer=require("puppeteer"),portfinder=require("portfinder"),{exec:exec}=require("child_process"),nodeFetch=require("node-fetch"),util=require("util"),replaceall=require("replaceall"),exit=()=>{process.exit(0)},globals={port:0,notfound:Math.random().toString(36).slice(2),basename:""},init=()=>__awaiter(void 0,void 0,void 0,(function*(){const e=yield createServer({configFile:`${process.cwd()}/vite.config.ts`,root:process.cwd(),mode:"COMPILE"}),i=yield portfinder.getPortPromise();yield e.listen(i);const t=yield(yield puppeteer.launch({args:["--no-sandbox"]})).newPage();yield t.goto(`http://localhost:${i}`);const o=()=>__awaiter(void 0,void 0,void 0,(function*(){yield new Promise((e=>setTimeout(e,2e3)));const i=yield t.evaluate((()=>sessionStorage.getItem("8769b6cf-ac3f-4d8c-b6b7-cd72d7910f35")));let n=yield t.evaluate((()=>sessionStorage.getItem("8769b6cf-ac3f-4d8c-b6b7-cd72d7910f35b")));null!=i&&null!=n?(yield t.close(),yield e.close(),n.length>0&&(n.startsWith("/")&&n.replace("/",""),n.endsWith("/")||(n+="/")),globals.basename=n,yield runner(JSON.parse(null!=i?i:"{}")),process.exit(0)):yield o()}));yield o()})),runner=e=>__awaiter(void 0,void 0,void 0,(function*(){yield build({root:process.cwd(),configFile:`${process.cwd()}/vite.config.ts`});const i=yield portfinder.getPortPromise(),t=exec(`npx --yes serve -s -p ${i} -n`,{cwd:`${process.cwd()}/dist/`});globals.port=i;const o=()=>__awaiter(void 0,void 0,void 0,(function*(){yield new Promise((e=>setTimeout(e,2e3)));const t=yield nodeFetch(`http://localhost:${i}`);if(t.ok&&200===t.status){yield(yield puppeteer.launch({args:["--no-sandbox"]})).newPage();const i={};for(const t in e){const o=e[t],n=void 0!==o.config&&"compile"in o.config?o.config:{compile:!1};if(n.compile)if("dynamic"===n.type){for(let e=n.params.length-1;e>-1;e--)n.params[e].includes("/")&&n.params.pop();if(n.params.length<1)continue}else"wildcard"===n.type&&(n.paths=[`/${globals.notfound}`]);i[o.path]=n}const t=[],o={};for(const e in i){let n=`${e}`;const s=i[e];let l=!1;n.endsWith("//")&&(l=!0,n=n.substring(0,n.length-2)),n.endsWith("/")&&(n=n.substring(0,n.length-1));const c=n.split("/");l&&c.push("/"),o[c.join("/")]=s;const r=c.map(((e,i)=>i===c.length-1?{path:e,config:s}:{path:e,config:void 0}));t.push(r)}const n=t.shift();for(const e of t)for(;void 0!==e.find((e=>void 0===e.config));){let i="",t=0;for(const o of e){if(void 0!==o.config)break;i+=`${o.path}/`,t++}i=i.substring(0,i.length-1),e[t-1].config=o[i]}t.unshift(n);const s=clean(t);buildPaths(s)}else yield o()}));yield o(),t.kill()})),clean=e=>{e=(e=e.filter((i=>{const t=i[i.length-1];if("/"===t.path){let o="";for(const{path:e}of i)o+=`${e}/`;for(o=o.substring(0,o.length-1);o.endsWith("/");)o=o.substring(0,o.lastIndexOf("/"));const n=e.find((e=>{let i="";for(const{path:t}of e)i+=`${t}/`;for(i=i.substring(0,i.length-1);i.endsWith("/");)i=i.substring(0,i.lastIndexOf("/"));return o===i}));return void 0!==n&&(n[n.length-1].config=t.config),!1}return!0}))).filter((e=>{var i;return!(!1===(null===(i=e[e.length-1].config)||void 0===i?void 0:i.compile)||void 0!==e.filter((e=>e.path.includes(":"))).find((e=>{var i;return!((null===(i=e.config)||void 0===i?void 0:i.compile)&&"dynamic"===e.config.type&&e.config.params.length>0)}))||void 0!==e.filter((e=>e.path.includes("*"))).find((e=>{var i;return!((null===(i=e.config)||void 0===i?void 0:i.compile)&&"wildcard"===e.config.type&&e.config.paths.length>0)})))}));for(const i of e)for(const e of i)if(e.config&&e.config.compile&&"dynamic"===e.config.type){const i=[""];e.config.params=e.config.params.filter((e=>!i.includes(e)&&(i.push(e),!0)))}else if(e.config&&e.config.compile&&"wildcard"===e.config.type){const i=[""];e.config.paths=e.config.paths.filter((e=>!i.includes(e)&&(i.push(e),!0)))}return e},buildPaths=e=>{let i=[];for(const t of e){if(0!==t.length){const e=buildCascadingCompilierConfigSegment(t);for(const t of e.paths)void 0!==e.child?i.push(...buildPathTree(t,e.child)):i.push(t)}const e=[];i=i.filter((i=>!e.includes(i)&&(e.push(i),!0))),i=i.map((e=>replaceall("//","/",e+="/")))}return console.log(util.inspect(i,!1,null,!1)),i},buildCascadingCompilierConfigSegment=e=>{const{path:i,config:t}=e.shift(),o=[];return"dynamic"===t.type?o.push(...t.params):"wildcard"===t.type?o.push(...t.paths):"$"===i?o.push(`localhost:${globals.port}/`):o.push(i),0===e.length?{paths:o}:{paths:o,child:buildCascadingCompilierConfigSegment(e)}},buildPathTree=(e,i)=>{const t=[],o=i.child;if(void 0!==o)for(const n of i.paths){let i=buildPathTree(n,o);i=i.map((i=>`${e}/${i}`)),t.push(...i)}else for(const o of i.paths)t.push(`${e}/${o}`);return t};__awaiter(void 0,void 0,void 0,(function*(){const e=yield createServer({configFile:`${process.cwd()}/vite.config.ts`,root:process.cwd(),mode:"COMPILE"}),i=yield portfinder.getPortPromise();yield e.listen(i);const t=yield(yield puppeteer.launch({args:["--no-sandbox"]})).newPage();yield t.goto(`http://localhost:${i}`);const o=()=>__awaiter(void 0,void 0,void 0,(function*(){yield new Promise((e=>setTimeout(e,2e3)));const i=yield t.evaluate((()=>sessionStorage.getItem("8769b6cf-ac3f-4d8c-b6b7-cd72d7910f35")));let n=yield t.evaluate((()=>sessionStorage.getItem("8769b6cf-ac3f-4d8c-b6b7-cd72d7910f35b")));null!=i&&null!=n?(yield t.close(),yield e.close(),n.length>0&&(n.startsWith("/")&&n.replace("/",""),n.endsWith("/")||(n+="/")),globals.basename=n,yield runner(JSON.parse(null!=i?i:"{}")),process.exit(0)):yield o()}));yield o()})).catch(console.error);
