#!/usr/bin/env node
'use strict';

// import/configure libs
const { execSync } = require("child_process");
const fs = require("fs");
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const ask = (query, defaultAnswer) => {
  return new Promise(resolve => {
    readline.question(`\x1b[94m${query} \x1b[37m(${defaultAnswer}) `, resolve);
  })
}

const configure = async () => {

  // configure octobox variables
  console.log("\x1b[94mWelcome! This CLI will create an Octobox app for you.\nPress \x1b[37m^C\x1b[94m at any time to quit.")

  // readline for path
  readline.question("\x1b[94mDevelopment path: \x1b[37m(./my-octobox-app/) ", answer => {

    // path creation
    let path;
    if(answer.length === 0) {
      path = "./my-octobox-app/";
    }else{
      path = answer;
    }
    if(path.startsWith("./")) {
      path = path.substring(2, path.length);
    }else if(path.startsWith("/")) {
      path = path.substring(1, path.length);
    }
    if(path.endsWith("/")) {
      path = path.substring(0, path.length - 1);
    }

    // readline for domain
    readline.question("\x1b[94mDomain name: \x1b[37m(https://my-octobox-app.test) ", answer => {

      // domain creation
      let domain;
      if(answer.length === 0) {
        domain = "https://my-octobox-app.test";
      }else{
        domain = answer;
      }
      if(domain.endsWith("/")) {
        domain = domain.substring(0, domain.length - 1);
      }

      // readline for host
      readline.question("\x1b[94mHosted path: \x1b[37m(/) ", answer => {

        // host creation
        let root;
        if(answer.length === 0) {
          root = "/";
        }else{
          root = answer;
        }
        if(root.startsWith("./")) {
          root = root.substring(2, root.length);
        }else if(root.startsWith("/")) {
          root = root.substring(1, root.length);
        }
        if(root.endsWith("/")) {
          root = root.substring(0, root.length - 1);
        }

        // readline for linter
        readline.question("\x1b[94mUse default linter configs: \x1b[37m(Y) ", answer => {

          // octobox linter config toggle
          answer = answer.toUpperCase();
          let octoboxLint;
          octoboxLint = answer.length === 0 || answer === "Y" || answer === "TRUE" || answer === "YES";

          // add customizations and generate
          customize(domain, root).then(customizations => generate(path, domain, root, octoboxLint, customizations));

        });

      });

    });

  });
};

const customize = async (domain) => {
  const title = lintCustomization(await ask("App name:", "Octobox app"), "Octobox app");
  const color = lintCustomization(await ask("Primary theme color:", "#000000"), "#000000");
  const bgColor = lintCustomization(await ask("Secondary theme color:", "#ffffff"), "#ffffff");
  const desc = lintCustomization(await ask("App description:", "An Octobox app"), "An octobox app");
  const keywords = lintCustomization(await ask("App keywords:", "octobox"), "octobox");
  const author = lintCustomization(await ask("App author:", "App developer"), "App developer");
  const creator = lintCustomization(await ask("App creator:", author), author);
  const publisher = lintCustomization(await ask("App publisher:", creator), creator);
  const banner = lintCustomization(await ask("App social media banner URL:", "https://http.cat/100"), "https://http.cat/100");
  const siteName = lintCustomization(await ask("App owner's website's name:", title), title);
  return {
    title,
    color,
    bgColor,
    desc,
    keywords,
    author,
    creator,
    publisher,
    banner,
    siteName,
    domain
  };
};

const lintCustomization = (str, defaultAnswer) => {
  if(str.length === 0) {
    return defaultAnswer;
  }else{
    return str;
  }
}

const generate = (path, domain, root, octoboxLint, customizations) => {

  readline.close();

  // gen cra template
  console.log("\x1b[94mCreating Octobox app. This will take a while...\x1b[37m");
  execSync(`npx --yes create-react-app@latest ${path} --template octobox`);

  // gen octobox items
  const packageJson = JSON.parse(fs.readFileSync(`./${path}/package.json`).toString());
  // add required to package
  packageJson.homepage = `/${root}`;
  // add customizations to package
  packageJson.name = customizations.name;
  packageJson.version = "0.0.0";
  packageJson.description = customizations.desc;
  packageJson.author = customizations.author;
  packageJson.license = "MIT";
  packageJson.keywords = customizations.keywords.split(",").map(value => value.trim());
  packageJson.stylelint = {
    "extends": ["./stylelintrc.js"]
  }
  packageJson.octobox = "1.2.0";
  fs.writeFileSync(`./${path}/package.json`, JSON.stringify(packageJson, null, 2));
  fs.writeFileSync(`./${path}/public/sitemap.txt`, `${domain}/%PUBLIC_URL%/?/`);
  if(!octoboxLint) {
    const eslint = JSON.parse(fs.readFileSync(`./${path}/.eslintrc.js`).toString().substring(17));
    const stylelint = JSON.parse(fs.readFileSync(`./${path}/.stylelintrc.js`).toString().substring(17));
    eslint.extends.length = 2;
    stylelint.extends.length = 1;
    fs.writeFileSync(`./${path}/.eslintrc.js`, `module.exports = ${JSON.stringify(eslint, null, 2)};\n`);
    fs.writeFileSync(`./${path}/.stylelintrc.js`, `module.exports = ${JSON.stringify(stylelint, null, 2)};\n`);
  }else{
    fs.writeFileSync(`./${path}/.eslintrc.js`, `${fs.readFileSync(`./${path}/.eslintrc.js`).toString()};\n`);
    fs.writeFileSync(`./${path}/.stylelintrc.js`, `${fs.readFileSync(`./${path}/.stylelintrc.js`).toString()};\n`);
  }

  // customize index, 404, and manifest
  let publicUrlRoot = "/";
  if(root.startsWith("/")) {
    publicUrlRoot = "";
  }
  const index =
`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${customizations.title}</title>
    <link rel="icon" href="${customizations.domain}${publicUrlRoot}%PUBLIC_URL%/favicon.ico"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="theme-color" content="${customizations.color}"/>
    <meta name="description" content="${customizations.desc}"/>
    <meta name="keywords" content="${customizations.keywords}"/>
    <meta name="robots" content="index, follow"/>
    <meta name="language" content="English"/>
    <meta name="revisit-after" content="1 days"/>
    <meta name="author" content="${customizations.author}"/>
    <meta name="creator" content="${customizations.creator}"/>
    <meta name="publisher" content="${customizations.publisher}"/>
    <meta property="og:title" content="${customizations.title}"/>
    <meta property="og:description" content="${customizations.desc}"/>
    <meta property="og:image" content="${customizations.banner}"/>
    <meta property="og:url" content="${customizations.domain}"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta property="og:site_name" content="${customizations.siteName}"/>
    <link rel="apple-touch-icon" href="${customizations.domain}${publicUrlRoot}%PUBLIC_URL%/logo192.png"/>
    <link rel="manifest" href="${customizations.domain}${publicUrlRoot}%PUBLIC_URL%/manifest.json"/>
    <script type="text/javascript">
      !function(n){if("/"===n.search[1]){var a=n.search.slice(1).split("&").map(function(n){return n.replace(/~and~/g,"&")}).join("?");window.history.replaceState(null,null,n.pathname.slice(0,-1)+a+n.hash)}}(window.location);
    </script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`;
  const notFound =
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="icon" href="${customizations.domain}${publicUrlRoot}%PUBLIC_URL%/favicon.ico"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${customizations.title}</title>
  <meta name="description" content="404 Not Found!">
  <script type="text/javascript">
    // path-begin
    // AUTO-GENERATED SECTION - DO NOT EDIT
    var pathSegmentsToKeep = 0;
    // path-end
    var l=window.location;l.replace(l.protocol+"//"+l.hostname+(l.port?":"+l.port:"")+l.pathname.split("/").slice(0,1+pathSegmentsToKeep).join("/")+"/?/"+l.pathname.slice(1).split("/").slice(pathSegmentsToKeep).join("/").replace(/&/g,"~and~")+(l.search?"&"+l.search.slice(1).replace(/&/g,"~and~"):"")+l.hash);
  </script>
</head>
<body>
</body>
</html>
`;
  const manifest = JSON.parse(fs.readFileSync(`./${path}/public/manifest.json`).toString());
  manifest.short_name = customizations.title;
  manifest.name = customizations.title;
  manifest.start_url = "%PUBLIC_URL%";
  manifest.theme_color = customizations.color;
  manifest.background_color = customizations.bgColor;
  fs.writeFileSync(`./${path}/public/index.html`, index);
  fs.writeFileSync(`./${path}/public/404.html`, notFound);
  fs.writeFileSync(`./${path}/public/manifest.json`, JSON.stringify(manifest, null, 2));
  fs.mkdirSync(`./${path}/src/assets/`);
  fs.mkdirSync(`./${path}/src/components/`);

  // legal stuff
  const year = new Date().getFullYear();
  const license = `MIT License

Copyright (c) ${year} ${customizations.publisher}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`
  fs.writeFileSync(`./${path}/LICENSE`, license);

  // run route builder once
  execSync("node octobox.js add", {cwd: `./${path}`});

  // finish install
  finishInstall(path);
};

const finishInstall = (path) => {
  // log completion
  console.log(`\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\x1b[94mScroll up for generation logs\n-----------------------------------------------\nSuccess! Octobox app created at \x1b[37m./${path}\x1b[94m!`);
  console.log(`We suggest that you begin by typing:

  cd \x1b[37m${path}
  \x1b[94mnpm start

Happy hacking!\x1b[37m`);
  console.log("\x1b[0m");
  process.exit();
}

configure().catch(e => console.log(e));
