const _ = require("lodash");
const fs = require("fs");

const input = fs.readFileSync("./day18.input", "utf-8").trim().split("\n");

const funcs = {
    "+": (a, b) => a + b,
    "*": (a, b) => a * b
}

function calcLtoR(input) {
    let a = input.shift();
    if (a === "(") {
        a = calcLtoR(takeBrackets());
    }
    let op = input.shift();
    let b = input.shift();
    if (b === "(") {
        b = calcLtoR(takeBrackets());
    }

    input.unshift(funcs[op](+a, +b))
    return input.length === 1 
            ? input[0]
            : calcLtoR(input);

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
                .map(calcLtoR)
                .sum()
                .value()

console.log("part1: " + part1);

function calcPart2(input) {
    for (let braIndex = input.indexOf("(");
     braIndex >= 0; 
     braIndex = input.indexOf("(")) {

        let subExpr = takeBrackets(input.slice(braIndex + 1))
        input = input.slice(0, braIndex)
        .concat(calcPart2(subExpr.slice(0))) // evil side effects!
        .concat(input.slice(braIndex + subExpr.length + 2))
    }

    for (addIndex = input.indexOf("+");
    addIndex >= 0;
    addIndex = input.indexOf("+")) {

        let addResult = +input[addIndex - 1] + (+input[addIndex + 1])
        input = input.slice(0, addIndex - 1).concat(addResult).concat(input.slice(addIndex + 2));
    }

    if (input.length === 1) return input[0];

    return calcLtoR(input);
    
    function takeBrackets(input) {
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

const part2 = _.chain(input)
                .map(str => str.replace(/\s/g, "").split(""))
                .map(calcPart2)
                .sum()
                .value()

console.log("part2: " + part2);