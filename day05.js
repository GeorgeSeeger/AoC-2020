const _ = require("lodash");
const fs = require("fs");

const lines = fs.readFileSync("./day05.input", 'utf8').split("\n");

const rows = 127;
const cols = 7;

function binaryFinder(lowChar) {
    return function find(lower, upper, instr) {
        if (instr.length === 0) return lower;
        const halfWay = Math.floor((lower + upper) / 2);
        return (instr[0] === lowChar)
            ? find(lower, halfWay, instr.slice(1))
            : find(halfWay + 1, upper, instr.slice(1))
    }

}

function toSeatInfo(input) {
    const findRow = binaryFinder('F');
    const findCol = binaryFinder('L');
    const row = findRow(0, rows, input.slice(0, 7))
    const col = findCol(0, cols, input.slice(7))
    return {row: row, col: col };
}

const seatIds = _.chain(lines)
    .map(toSeatInfo)
    .map(seat => 8 * seat.row + seat.col)
    .value();

const part1 = _.chain(seatIds)
            .sortBy(i => i)
            .last()
            .value();

console.log("part1: " + part1);

const part2 = _.chain(seatIds).sortBy(i => i).find((id, ind, seats) => {
    if (seats[ind + 1] - id === 2) return true;
}).value() + 1;

console.log("part2: " + part2);