const _ = require("lodash");
const fs = require("fs");

const lines = fs.readFileSync("./day11.input", 'utf8').trim().split("\n");
const initialSeating = _.map(lines, i => i.trim().split(""));

const floor = ".";
const empty = "L";
const occpd = "#";

function applyRules(seating) {
    var newSeating = _.cloneDeep(seating);

    for (let r = 0; r < seating.length; r++) {
        for (let c = 0; c < seating[0].length; c++) {
            
            var seat = seating[r][c];
            if (seat === floor) continue;
            
            var nearby = [];
            for (let i = Math.max(0, r - 1); i <= Math.min(seating.length - 1, r + 1); i++) {
                for (let j = Math.max(0, c -1); j <= Math.min(seating[0].length - 1, c + 1); j++) {
                    if (i === r && j === c) { 
                        continue;
                    }
                    nearby.push(seating[i][j]);
                }
            }

            let nearbyOccupied = _.filter(nearby, s => s === occpd).length;
            if (seat === empty) {
                if (nearbyOccupied === 0) {
                    newSeating[r][c] = occpd;
                }
            } else {
                if (nearbyOccupied >= 4) {
                    newSeating[r][c] = empty;
                }
            }
        }
    }

    return newSeating;
}

const part1 = (function() {
    let current = initialSeating;
    let next = applyRules(current);
    while (!_.isMatch(current, next)) {
        current = next;
        next = applyRules(current);
        // console.log(next.map(i => i.join("")).join("\n"));
        // console.log("");
    } 

    return _.chain(next).flatten().countBy(s => s === occpd).value().true;
})();

console.log("part1: " + part1);

