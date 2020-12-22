const _ = require("lodash");
const fs = require("fs");

const input = fs.readFileSync("./day22.input", "utf-8").trim().split("\n\n")

const toDeck = str => str.split("\n").slice(1).map(i => +i);
const player1 = toDeck(input[0]);
const player2 = toDeck(input[1]);

const part1 = (function() {
    while (player1.length && player2.length) {
        let a = player1.shift();
        let b = player2.shift();

        if (a > b) {
            player1.push(a, b)
        } else {
            player2.push(b, a);
        }
    }

    return _.chain(player1).concat(player2).reverse().reduce((acc, v, i) => acc + v * (i + 1), 0)
})()

console.log("part1: " + part1);