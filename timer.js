const fs = require("fs");

// Measure-Command { node timer.js | Out-Host }
for (let file of fs.readdirSync("./")) {
  if (/day\d+.js/.test(file)) {
  console.log(`\n${file}:`)
  require("./" + file);
  }
}