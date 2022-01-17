#!/usr/bin/env node
'use strict';

//logger
const log = (msg) => {
  console.log(`\x1b[94m${msg}\x1b[0m`);
}

// main fun
const run = async () => {
  log("This package is in development, come back later!");
}

// main caller
run().catch(console.error);
