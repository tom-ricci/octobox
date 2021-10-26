const fs = require("fs-extra");
const glob = require("fast-glob");
const build = async () => {
  const routes = await glob("pages/**/{Index.{tsx,jsx},[[]*.{tsx,jsx}}");
  const finalRoutes = {"routes": routes};
  await fs.writeJson(`${__dirname}/routes.json`, finalRoutes);
};
build().catch(console.log);