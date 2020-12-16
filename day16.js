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

const validTickets = _.chain(lines[2].split("\n"))
.slice(1)
.map(l => l.trim().split(",").map(i => +i))
.filter(field => _.every(field, fv => _.some(rules, (rule, ruleName) => rule(fv))))
.value();

// all possible index (0-19) as a starting point
const rulePositions = _.chain(rules).toPairs()
.map((ruleArr, ind, coll) => [ruleArr[0], coll.map((r, i) => i)])
.fromPairs().value();

// invert the valid tickets to get one row of all field #0, then field #1 etc.
let inverted = _.reduce(validTickets, (acc, ticket) => {
    _.forEach(ticket, (fv, i) => {
      if (!acc.hasOwnProperty(i)) acc[i] = [];
      acc[i].push(fv);
    })
    return acc;
  }, {})

// then remove all the indexes from possible rule positions
// where any values don't follow the rules
_.forEach(rules, (rule, ruleName) => {
  for (let i = 0; i < _.size(inverted); i++) {
    if (_.some(inverted[i], j => !rule(j))) {
      rulePositions[ruleName] = _.reject(rulePositions[ruleName], k => k === i); 
    }
  }
})

// then, if we have a rule that can only be in one field #, remove that position from all other possibilities
// and then if we have another that only has one possibility, remove *that* one etc.
let skip = {};
while (_.size(_.filter(rulePositions, v => v.length > 1))) {
  let certainPositions = _.filter(_.toPairs(rulePositions), arr => arr[1].length === 1);
  _.forEach(certainPositions, certainPosition => {
    if (skip[certainPosition[0]]) return;

    _.forEach(rulePositions, (positions, ruleName) => {
      if (ruleName === certainPosition[0]) return;
      rulePositions[ruleName] = _.reject(positions, k => k === certainPosition[1][0])
    })
    skip[certainPosition[0]] = true;
  })
}

const myTicket = lines[1].split("\n")[1].split(",").map(i => +i);

// finally, get the product of all fields that start with departure
const part2 = _.chain(rulePositions)
.filter((index, ruleName) => ruleName.startsWith("departure"))
.map(index => myTicket[index[0]])
.reduce((acc, i) => acc * i, 1)
.value();

console.log("part2: " + part2);