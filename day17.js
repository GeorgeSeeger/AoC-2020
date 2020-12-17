const _ = require("lodash");
const fs = require("fs");

let zMax = 0;
let zMin = 0;
let yMin = 0;
let yMax = 0;
let xMin = 0;
let xMax = 0;

let input = fs.readFileSync("./day17.input", 'utf8')
.trim().split("\n")
.reduce((acc, val, j) => {
    val.split("").forEach((c, i) => {
        if (c === '#') {
            acc["0|" + j + "|" + i] = true;
            assignLimits(i, j, 0);
        }
    })
    return acc;
}, {});

function assignLimits(x, y, z) {
    zMin = Math.min(zMin, z);
    zMax = Math.max(zMax, z);
    yMin = Math.min(yMin, y);
    yMax = Math.max(yMax, y);
    xMin = Math.min(xMin, x);
    xMax = Math.max(xMax, x);
}

function cycle(state) {
    let nextState = _.clone(state);

    for (let z = zMin - 1; z <= zMax + 1; z++) {
        for (let y = yMin - 1; y <= yMax + 1; y++) {
            for (let x = xMin - 1; x <= xMax + 1; x++) {
                let neighbours = getNeighbours(x,y,z);
                let activeCount = neighbours.filter(c => c[1]).length;
                let cube = getCube(x, y, z)

                if (cube[1]) {
                    if (2 <= activeCount && activeCount <= 3) {
                        setCube(...cube[0], true)
                    } else {
                        setCube(...cube[0], false)
                    }
                } else {
                    if (activeCount === 3) {
                        setCube(...cube[0], true)
                    }
                }
            }
        }
    }

    return nextState;

    function getNeighbours(x, y, z) {
        let n = [];
        for (let k = z - 1; k <= z + 1; k++) {
            for (let j = y - 1; j <= y + 1; j++) {
                for (let i = x - 1; i <= x + 1; i++) {
                    if (i === x && j === y && k === z) continue;
                    
                    n.push(getCube(i, j, k))
                }
            }
        }
        return n;
    }

    function getCube(x, y, z) {
        let key = [z, y, x].join("|");
        if (state[key]) {
            return [[x, y, z], state[key]]
        }
        return [[x, y, z], false];
    }

    function setCube(x, y, z, newVal) {
        var key = [z,y,x].join("|");
        if (!newVal) {
            if (nextState[key]) {
                delete nextState[key]
            }
        } else {
            nextState[key] = true
            assignLimits(x, y, z);
        }

    }
}

const part1 = (function() {
    for (let i = 0; i < 6; i++) {
        input = cycle(input);
    }

    return _.size(input);
})();

console.log("part1: " + part1);