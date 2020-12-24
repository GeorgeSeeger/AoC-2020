const _ = require("lodash");
const fs = require("fs");

const input = fs.readFileSync("./day24.input", "utf-8").trim().split("\n")

let blackTiles = {};
let isBlack= (c) => {
    return _.has(blackTiles, c.join());
}
let flip = (c) => {
    let key = c.join();
    if (isBlack(c)) delete blackTiles[key];
    else blackTiles[key] = true;
}

_.forEach(input, instr => {
    let tokens = instr.trim().split("");
    let pos = [0, 0];
    while (tokens.length) {
        let token = tokens.shift();
        if (token === "n" || token === "s") token += tokens.shift();

        switch (token) {
            case "w":
                pos[0]++; break;
            case "e":
                pos[0]--;break;
            case "sw":
                pos[0]++;
                pos[1]--;
                break;
            case "se":
                pos[1]--;
                break;
            case "nw":
                pos[1]++;
                break;
            case "ne":
                pos[0]--;
                pos[1]++;
                break;
        }
    }
    flip(pos);
})

const part1 = _.size(blackTiles);
console.log("part1: " + part1);

function hexGameOfLifeCycle(blackTiles) {
    let next = _.clone(blackTiles);
    function getNeighbours(c) {
        return [
            [c[0] + 1, c[1]],
            [c[0] - 1, c[1]],
            [c[0] - 1, c[1] + 1],
            [c[0] + 1, c[1] - 1],
            [c[0]    , c[1] + 1],
            [c[0]    , c[1] - 1]
        ];
    }

    let blacks = _.keys(blackTiles).map(c => c.split(",").map(i => +i));
    let whites = _.chain(blacks)
    .map(getNeighbours)
    .flatten()
    .uniqBy(c => c.join())
    .reject(isBlack)
    .value();
    
    for (let c of blacks) {
        let blackCount = getNeighbours(c).filter(isBlack).length;
        if (blackCount === 0 || blackCount > 2) {
            delete next[c.join()]
        }
    }

    for (let c of whites) {
        let blackCount = getNeighbours(c).filter(isBlack).length;
        if (blackCount === 2) {
            next[c.join()] = true;
        }
    }

    return next;
}

for (let i = 0; i < 100; i++) {
    blackTiles = hexGameOfLifeCycle(blackTiles);
}

const part2 = _.size(blackTiles);
console.log("part2: " + part2);
