const _ = require("lodash");
const fs = require("fs");

const input = fs.readFileSync("./day18.input", "utf-8").trim().split("\n");

const funcs = {
    "+": (a, b) => a + b,
    "*": (a, b) => a * b
}

function calcPart1(input) {
    if (input.length === 1) return input[0];
    if (input.length < 1) return 0;

    let a = input.shift();
    if (a === "(") {
        a = calcPart1(takeBrackets());
    }
    let op = input.shift();
    let b = input.shift();
    if (b === "(") {
        b = calcPart1(takeBrackets());
    }

    input.unshift(funcs[op](+a, +b))
    return calcPart1(input);

    function takeBrackets() {
        let bCount = 1;
        let inner = []
        while (bCount > 0) {
            let c = input.shift();
            if (c === "(") bCount++;
            if (c === ")") bCount--;
            if (bCount > 0) inner.push(c);
        }
        return inner;
    }
}

const part1 = _.chain(input)
                .map(str => str.replace(/\s/g, "").split(""))
                .map(calcPart1)
                .sum()
                .value()

console.log("part1: " + part1);