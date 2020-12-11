const _ = require("lodash");
const fs = require("fs");

const lines = fs.readFileSync("./day6.input", 'utf8').split("\n\n");

const part1 = _.chain(lines).map((group) => {
    return _.chain(group)
    .split("\n")
    .join("")
    .split("")
    .groupBy(a => a)
    .size()
    .value();
})
.sum()
.value();

console.log("part1: " + part1);