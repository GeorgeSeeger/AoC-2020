const _ = require("lodash");
const fs = require("fs");

var lines = fs.readFileSync("./day2.input", 'utf8')
.split('\n')
.map(i => i.split(/[-|:?\s]/));

var isValidInDay1 = arr => {
    var l = +arr[0];
    var u = +arr[1];
    var count = arr[4].split('').filter(c => c === arr[2]).length;

    return l <= count && count <= u;
};


var part1 = _.chain(lines).filter(isValidInDay1).size().value();
console.log("part 1: " + part1);

var isValidInDay2 = arr => {
    const firstChar = arr[4][+arr[0] - 1] === arr[2];
    const lastChar = arr[4][+arr[1] - 1] === arr[2];
    return (firstChar ^ lastChar);
}
var part2 = _.chain(lines).filter(isValidInDay2).size().value();
console.log("part 2: " + part2)