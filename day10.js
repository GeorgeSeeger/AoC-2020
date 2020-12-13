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

allChargers.push(_.last(allChargers) + 3);

const part2 = (function() {
    const memo = {};
    const inner = function(chargers) {
        var key = chargers.join("-");
        if (memo[key]) { return memo[key]; }
        if (chargers.length === 2) {
            return 1;
        }

        var val = chargers[0];
        var combos = 0;
        for (let i = 1; i <= Math.min(3, chargers.length - 1); i++) {
            if (chargers[i] - val <= 3) {
                combos += inner(chargers.slice(i))
            }
        }
        memo[key] = combos;
        return combos;
    }
    return inner;
})()(allChargers)

console.log("part2: " + part2 );