const _ = require("lodash");
const fs = require("fs");

const lines = fs.readFileSync("./day7.input", 'utf8').split("\n");

const rules = _.reduce(lines, (acc, rule) => {
    const foo = rule.split(" bags contain ");
    const colour = foo[0];
    const bags = foo[1].split(", ")

    if (bags[0].includes("no other bags.")) {
        acc[colour] = {}
    } else {
        acc[colour] = _.fromPairs(bags.map(numBag => {
            var numberAndColour = /(\d+) (.*) bags?\.?/.exec(numBag);
            return [[numberAndColour[2]], numberAndColour[1]];
        }))
    }
    return acc;
}, {});

const shinyGold = "shiny gold";
function findBagsThatDirectlyContain(colour) {
    return _.keys(_.pickBy(rules, (contains, forColour) => {
        return contains.hasOwnProperty(colour);
    }));
}

function findAllBagsThatCanHold(colour) {
   var bagList = findBagsThatDirectlyContain(colour);
   var answer = _.keyBy(bagList);
   
   while (!_.isEmpty(bagList)) {
        var bag = bagList.shift();
        _.forEach(findBagsThatDirectlyContain(bag), (otherBag) => {
            if (answer.hasOwnProperty(otherBag)) return;
            answer[otherBag] = otherBag;
            bagList.push(otherBag);
        })
   }

   return answer;
}

const part1 = _.size(findAllBagsThatCanHold(shinyGold));
console.log("part1: " + part1);

function countBagsContainedBy(colour) {
    const bagsInside = rules[colour];
    if (_.isEmpty(bagsInside)) return 1;

    const innerBagCount = _.map(bagsInside, (count, col) => {
        return (+count) * countBagsContainedBy(col);
    });
    return 1 + _.sum(innerBagCount);
}

const part2 = countBagsContainedBy(shinyGold) - 1;

console.log("part2: " + part2);