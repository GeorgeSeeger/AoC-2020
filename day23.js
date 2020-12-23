const _ = require("lodash");

const inputPart1 = '624397158'.split("").map(i => +i);

const moves = 100;

var cups = inputPart1;
var currPos = 0;
for (let i = 0; i < moves; i++) {
    let current = cups[currPos];
    currPos = cups.indexOf(current);
    let pickUp = cups.slice(currPos + 1, (currPos + 4) > cups.length ? cups.length : currPos + 4).concat(cups.slice(0, currPos + 4 > cups.length ? currPos + 4 - cups.length : 0));
    cups = _.difference(cups, pickUp);
    let destination = (() => {
        let dest = current - 1;
        let min = Math.min(...cups);
        let max = Math.max(...cups);
        while (!cups.includes(dest)) {
            dest = cups.includes(dest - 1) || dest - 1 > min ? dest - 1 : max;
        }
        return dest;
    })();
    let destPos = cups.indexOf(destination);
    cups.splice((destPos + 1), 0, ...pickUp);
    currPos = (cups.indexOf(current) + 1) % cups.length;
}

const part1 = cups.slice(cups.indexOf(1) + 1).concat(cups.slice(0, cups.indexOf(1))).join("")
console.log("part1: " + part1);