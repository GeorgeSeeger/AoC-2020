const _ = require("lodash");
const fs = require("fs");

const lines = fs.readFileSync("./day12.input", 'utf8').trim().split("\n");

function part1Instructions() {
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
function solve(makeInstr) {
    let pos = { x: 0, y: 0};
    let instrs = makeInstr();
    lines.forEach(line => {
        let instr = line[0];
        let arg = parseInt(line.slice(1))
        instrs[instr](pos, arg);
    })
    return Math.abs(pos.x) + Math.abs(pos.y);
}
const part1 = solve(part1Instructions);

console.log("part1: " + part1);

function part2Instructions() {
    let wp = { x: 10, y: 1}

    const instrs = {
        N: (pos, dist) => { wp.y += dist },
        S: (pos, dist) => { wp.y -= dist },
        E: (pos, dist) => { wp.x += dist },
        W: (pos, dist) => { wp.x -= dist },
        F: (pos, dist) => { for (let i = 0; i < dist; i++) { pos.x += wp.x; pos.y += wp.y }},
        R: (pos, angle) => {
            for (let i = 0; i < angle; i += 90) {
                let x = wp.x;
                wp.x = wp.y;
                wp.y = -x;
            }
        },
        L: (pos, angle) => {
            for (let i = 0; i < angle; i += 90) {
                let x = wp.x;
                wp.x = -wp.y;
                wp.y = x;
            }
        }
    }
    return instrs;
}

const part2 = solve(part2Instructions);

console.log("part2: " + part2);