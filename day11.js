const _ = require("lodash");
const fs = require("fs");

const lines = fs.readFileSync("./day11.input", 'utf8').trim().split("\n");
const initialSeating = _.map(lines, i => i.trim().split(""));

const floor = ".";
const empty = "L";
const occpd = "#";

function part1Rules(seating) {
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

function solve(applyRules) {
    let current = initialSeating;
    let next = applyRules(current);
    while (!_.isMatch(current, next)) {
        current = next;
        next = applyRules(current);
    } 

    return _.chain(next).flatten().countBy(s => s === occpd).value().true;
}

const part1 = solve(part1Rules);

console.log("part1: " + part1);

function part2Rules(seating) {
    var newSeating = _.cloneDeep(seating);

    for (let r = 0; r < seating.length; r++) {
        for (let c = 0; c < seating[0].length; c++) {
            
            var seat = seating[r][c];
            if (seat === floor) continue;
            
            var nearby = [];
            var directions = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1,0], [-1, -1], [0, -1], [1, -1]];
            _.forEach(directions, dir => {
                let i = r;
                let j = c;
                const move = () => { i += dir[0], j += dir[1]}
                move();
                while (0 <= i && i < seating.length && 0 <= j  && j < seating[0].length) {
                    let seat = seating[i][j];
                    if (seat === empty || seat === occpd) {
                        nearby.push(seat);
                        break;
                    }
                    move();
                }
            }) 


            let nearbyOccupied = _.filter(nearby, s => s === occpd).length;
            if (seat === empty) {
                if (nearbyOccupied === 0) {
                    newSeating[r][c] = occpd;
                }
            } else {
                if (nearbyOccupied >= 5) {
                    newSeating[r][c] = empty;
                }
            }
        }
    }

    return newSeating;
}

const part2 = solve(part2Rules);

console.log("part2: " + part2);