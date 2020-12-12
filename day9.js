const _ = require("lodash");
const fs = require("fs");

const lines = fs.readFileSync("./day9.input", 'utf8').trim().split("\n").map(i => parseInt(i));
const preamble = 25;

const isValid = (val, index) => {
  return _.chain(lines).slice(index).take(preamble)
  .some((i, _ind, collection) =>
    _.some(collection, j => j + i === val && j !== i)
  ).value();
}

const part1 = _.chain(lines).slice(preamble)
.find((i, index) => !isValid(+i, index))
.value();

console.log("part1: " + part1);

var sumLength = 0;
const sumsToPart1  = _.chain(lines)
  .findIndex((val, ind, collection) => {
    let sum = val;
    while (sum <= part1) {
       sum += collection[ind + (++sumLength)]
       if (sum === part1) return true;
    }
    sumLength = 0;
    return false;
  })
  .value();

const part2 = _.chain(lines)
.slice(sumsToPart1, sumsToPart1 + sumLength + 1)
.sortBy(i => i)
.filter((val, ind, sums) => ind === 0 || ind === sums.length - 1)
.sum()
.value();

console.log("part2: " + part2);