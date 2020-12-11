const _ = require("lodash");
const fs = require("fs");

var lines = fs.readFileSync("./day3.input", 'utf8')
.split('\n')
const rep_length = lines[0].length;

function findTrees(r, d) {
    var r_pos = 0;
    var trees = 0;
    for (var d_pos = 0; d_pos < lines.length; r_pos = (r_pos + r) % rep_length
                                            , d_pos += d) {
        if (lines[d_pos][r_pos] === '#') trees++;
    }
    return trees;
}

console.log("part1: " + findTrees(3, 1));

const slopes = [[1,1], [3,1], [5,1], [7, 1], [1, 2]]

const part2 = _.chain(slopes)
.map(rd => findTrees(...rd))
.reduce((acc, val) => acc * val)
.value();
console.log("part2: " + part2)