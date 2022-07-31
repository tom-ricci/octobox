describe("Test Routing", () => {

  it("Opens the routing demo", () => {
    cy.visit("http://localhost:3000/", { timeout: 10000 });
    // go to the app, make sure we can get to the demo in the first place
    cy.contains("Hi, I'm Octotest!");
    cy.contains("/routing").click();
    cy.contains("Routing Demo");
  });

  it("Tests preloading", () => {
    cy.visit("http://localhost:3000/routing", { timeout: 10000 });
    // if we can get to the demo, see if /render loads. we know it'll load because the loader changes a dom element (which should already be loaded) to be this hash, so if this hash exists in the dom somewhere it loaded
    cy.contains("fe56d0ba1ab759a2d0fbb9d8365a4ed3");
    // do the same with /hover, except hover over the element
    cy.contains("/hover").trigger("mouseover");
    cy.contains("2755416d890f230a953d49ee6606cb25");
    // and finally with /never, making sure it loads only when clicked
    cy.contains("/never").click();
    cy.contains("486afe2a7deb8162e2098ae9fc1ae2e8");
  });

  it("Tests dynamic routing", () => {
    cy.visit("http://localhost:3000/routing", { timeout: 10000 });
    // go to the variable route and check if :variable has been changed to "octobox"
    cy.contains("/nested/:variable").click();
    cy.contains("This is a variable (parameter) window, which can take any value at its position in the path. For example, this window is located at /routing/nested/:variable. Your path is currently /routing/nested/octotest, so :variable was replaced with octotest!");
    // go to the not found page, check if that exists
    cy.contains("/notfound").click();
    cy.contains("This window isn't any actual route, but rather a 404 page. If no routes match, it'll be loaded instead.");
  });

  it("Tests serialized loaders", () => {
    cy.visit("http://localhost:3000/routing", { timeout: 10000 });
    // check if the loader was executed in sync. we know it was in sync if the child loader received the parent's data, and we know that's the case because we put what the child loader returned (a combination of its data and the parents data) in our content -- so we just have to check if the data is in the content
    cy.contains("/nested/sync").click();
    cy.contains("This component has a data loader which was executed in sync. It waited for its parent loader to execute before executing so it could access its data. It has access to its parent /nested's data (1) and access to its own data (2). In this demo, it's under /nested because /routing doesn't have a data loader.");
  });

  it("Tests asynchronous loaders", () => {
    cy.visit("http://localhost:3000/routing", { timeout: 10000 });
    // go to our hover component, since it's an easy one to work with. check to make sure its loader returned "ooga booga". yes, its a very VERY professional string
    cy.contains("/hover").click();
    cy.contains("This window was prefetched on hover. Octobox waited for you to hover over the anchor that brought you here before prefetching. The data loader (which is the same as render's loader) waited too. Its value is ooga booga.");
  });

  it("Tests expensive loaders", () => {
    cy.visit("http://localhost:3000/routing", { timeout: 10000 });
    // we need to check for the hash to be updated to what it was when we tested /render since /render can possibly cause this to change unexpectedly. thus, we just need to wait for it to do so and move on.
    cy.contains("fe56d0ba1ab759a2d0fbb9d8365a4ed3");
    // go to /expensive, which will first set that element with the hashes from earlier to a specific hash. once it's done, itll set the element to a different hash. we need a long timeout on the second check because it's an expensive loader -- 10 seconds is more than enough time for it to finish since its a minimum of 5 seconds
    cy.contains("/expensive").click();
    cy.contains("8c2c041692b7f2dd4e665084b55cc1c9");
    cy.contains("5144ed130176a9c9bdca9b1fb1e283fc", { timeout: 10000 });
  });

  it("Tests stateful anchors", () => {
    cy.visit("http://localhost:3000/routing", { timeout: 10000 });
    // make sure the anchor (by default) doesn't have a background, then once its active make sure it does
    cy.contains("/stateful").get("span").should("not.have.class", "bg-fuchsia-500").click();
    cy.contains("/stateful").get("span").should("have.class", "bg-fuchsia-500");
  });

  it("Tests redirects", () => {
    cy.visit("http://localhost:3000/routing", { timeout: 10000 });
    // find the redirect, click it, and make sure it redirected properly
    cy.contains("/redirect").click();
    cy.contains("/awholenewworld");
  });

  it("Tests metadata", () => {
    cy.visit("http://localhost:3000/routing", { timeout: 10000 });
    // go to the metadata route and make sure the title updates when we go to it
    cy.contains("/meta").click();
    cy.title().should("equal", "Routing - Metadata Demo");
  });

  it("Tests forms", () => {
    cy.visit("http://localhost:3000/routing", { timeout: 10000 });
    // go to the input page, type in some data, submit it, and make sure it was sent to the results page
    cy.contains("/input").click();
    cy.get("#username").type("bob");
    cy.get("#password").type("bobs super ultra secure password");
    cy.get("#submit").click();
    cy.contains(`Your username is "bob" and your password is "bobs super ultra secure password".${""}`);
  });

  it("Tests error components", () => {
    cy.visit("http://localhost:3000/routing", { timeout: 10000 });
    // find the error component and click it, then make sure it has the correct content
    cy.contains("/error").click();
    cy.contains("This window wasn't supposed to load");
  });

});
