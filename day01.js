const _ = require("lodash");
const fs = require("fs");
const { filter } = require("lodash");

var lines = fs.readFileSync("./day01.input", 'utf8').split('\n').map(i => +i);

function solve(predicate) {
    return _.chain(lines)
    .filter(predicate)
    .reduce((acc, i) => acc * i)
    .value();
}

const part1 = solve((i, ind, coll) => {
        return _.find(coll, (j) => i + j === 2020)
})

console.log("part1: " + part1);

const part2 = solve((i, ind, coll) => {
    return _.find(coll, j => _.find(coll, k => i + j + k === 2020))
})

console.log("part2: " + part2);