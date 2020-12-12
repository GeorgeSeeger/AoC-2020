const _ = require("lodash");
const fs = require("fs");

const lines = fs.readFileSync("./day10.input", 'utf8').trim().split("\n").map(i => parseInt(i));

lines.push(0);
const allChargers = _.sortBy(lines, i => i)

const part1 = _.chain(allChargers).groupBy((val) => {
    const index = _.findIndex(allChargers, i => i === val);
    if (index === allChargers.length - 1) { return 3}
    return allChargers[index + 1] - val;
}).mapValues(a => a.length)
.reduce((acc, diffCnt) => acc * diffCnt)
.value();

console.log("part1: " + part1);