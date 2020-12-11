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

const part2 = _.chain(lines).map((group) => {
    var answers = group.split("\n")
    return _.chain(answers)
    .join("").split("")
    .groupBy(a => a)
    .filter(numAnswers => numAnswers.length === answers.length)
    .size()
    .value();
})
.sum()
.value();

console.log("part2: " + part2);