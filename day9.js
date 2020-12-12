const _ = require("lodash");
const fs = require("fs");

const lines = fs.readFileSync("./day9.input", 'utf8').trim().split("\n").map(i => parseInt(i));
const preamble = 25;

const isValid = (val, index) => {
  return _.chain(lines).slice(index).take(preamble)
  .some((i, _ind, collection) =>
    _.some(collection, j => j + i === val && j !== i)
  )
  .value();
}

const part1 = _.chain(lines).slice(preamble)
.find((i, index) => !isValid(+i, index))
.value();

console.log("part1: " + part1);