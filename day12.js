const _ = require("lodash");
const fs = require("fs");

const lines = fs.readFileSync("./day12.input", 'utf8').trim().split("\n");

function makeInstr() {
    let shipDir = "E";

    const turn = (rOrL, pos, angle) => {
        let add = angle / 90;
        let index = turns.indexOf(shipDir);
        if (rOrL.startsWith("R")) {
            shipDir = turns[(index + add) % turns.length]
        } else {
            shipDir = turns[index < add ? turns.length + index - add : index - add];
        }
    }

    const instrs = {
        N: (pos, dist) => { pos.y += dist},
        E: (pos, dist) => { pos.x += dist},
        S: (pos, dist) => { pos.y -= dist},
        W: (pos, dist) => { pos.x -= dist},
        F: (pos, dist) => instrs[shipDir](pos, dist),
        R: _.partial(turn, "R"),
        L: _.partial(turn, "L"),
    }

    const turns = "NESW".split("");

    return instrs;
}

const part1 = (function() {
    let pos = { x: 0, y: 0 }
    let instrs = makeInstr();
    lines.forEach(line => {
        let instr = line[0];
        let arg = parseInt(line.slice(1))
        instrs[instr](pos, arg);
    })
    return Math.abs(pos.x) + Math.abs(pos.y);
})();

console.log("part1: " + part1);