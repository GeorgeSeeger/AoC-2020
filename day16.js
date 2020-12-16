const _ = require("lodash");
const fs = require("fs");

let lines = fs.readFileSync("./day16.input", 'utf8').trim().split("\n\n");

let rules = _.chain(lines[0].split("\n")).map(l => {
  var ruleName = l.trim().split(": ")[0];
  var ranges = _.map(l.split(": ")[1].split(" or "), r => r.split("-").map(i => +i))
  var rule = (i) => {
    return ranges[0][0] <= i && i <= ranges[0][1]
      ||   ranges[1][0] <= i && i <= ranges[1][1];
  }
  return [ruleName, rule];
}).fromPairs()
.value();

const part1 = _.chain(lines[2].split("\n"))
        .slice(1)
        .map(l => l.trim().split(",").map(i => +i))
        .map(field => {
          return _.filter(field, fv => _.every(rules, (rule, ruleName) => {
            return !rule(fv);
          }))
        })
        .flatten()
        .sum()
        .value();

console.log("part1: " + part1);
