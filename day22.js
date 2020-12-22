const _ = require("lodash");
const fs = require("fs");

const input = fs.readFileSync("./day22.input", "utf-8").trim().split("\n\n")

const toDeck = str => str.split("\n").slice(1).map(i => +i);
const player1 = toDeck(input[0]);
const player2 = toDeck(input[1]);

const part1 = (function(p1, p2) {
    while (p1.length && p2.length) {
        let a = p1.shift();
        let b = p2.shift();

        if (a > b) {
            p1.push(a, b)
        } else {
            p2.push(b, a);
        }
    }

    return _.chain(p1).concat(p2).reverse().reduce((acc, v, i) => acc + v * (i + 1), 0)
})(_.clone(player1), _.clone(player2))

console.log("part1: " + part1);

const part2 = (function(p1, p2) {
    function getKey(p1, p2) {
        return [p1, p2].map(p => p.join("-")).join("|");
    }
    function recursiveCombat(p1, p2) {
        let record = {}
        while (p1.length && p2.length) {
            if (_.has(record, getKey(p1, p2))) return true;
            record[getKey(p1, p2)] = true;

            let a = p1.shift();
            let b = p2.shift();

            if (a <= p1.length && b <= p2.length) {
                if (recursiveCombat(p1.slice(0, a), p2.slice(0, b))) {
                    p1.push(a, b);
                } else {
                    p2.push(b, a);
                }

            } else if (a > b) {
                p1.push(a, b);
            } else {
                p2.push(b, a);
            }
        }

        return p1.length > 0;
    }

    recursiveCombat(p1, p2);
    return _.chain(p1).concat(p2).reverse().reduce((acc, v, i) => acc + v * (i + 1), 0);
})(player1, player2);

console.log("part2: " + part2);

