const _ = require("lodash");
const fs = require("fs");
const { partialRight } = require("lodash");

const input = fs.readFileSync("./day20.input", "utf-8").trim().split("\n\n");

function rotate(array, n) {
    let len = array.length;
    return array.map((line, j) => {
        let lineLen = line.length;
        return line.map((v, i) => {
            if (n === 1) {
                return array[i][len - j - 1]
            }
            if (n === 2) {
                return array[len - j - 1][len - i - 1]
            }
            if (n === 3) {
                return array[len - i - 1][j]
            }
            if (n === 4) {
                return v
            }
        })
    })
}

function flip(array, isVert, isHorz) {
    let len = array.length;
    return array.map((line, j) => {
        return line.map((v, i) => {
            return array[isVert ? len - j - 1 : j][isHorz ? len - i - 1 : i]
        });
    })
}

class Tile {
    static parse(input) {
        const info = input.split("\n");
        const id = parseInt(info[0].split(" ")[1])
        const data = _.chain(info).tail().map(str => str.split("")).value();
        return new Tile(id, data);
    }

    constructor(id, data) {
        this.id = id;
        this.data = data;
    }

    get top() {
        return this.data[0].reduce((acc, v) => (v === '#' ? (acc + 1)  : acc) << 1, 0);
    }

    get bottom() {
        return _.last(this.data).reduce((acc, v) => (v === "#" ? (acc + 1)  : acc) << 1, 0);
    }

    get left() {
        return this.data.reduce((acc, line) => (line[0] === "#" ? (acc + 1)  : acc) << 1, 0);
    }

    get right() {
        return this.data.reduce((acc, line) => (_.last(line) === "#" ? (acc + 1)  : acc) << 1, 0);
    }

    flipV() {
        return new Tile(this.id, flip(this.data, true, false));
    }

    flipH() {
        return new Tile(this.id, flip(this.data, false, true)) 
    }

    rotate90() {
        return new Tile(this.id, rotate(this.data, 1)) ;
    }

    rotate180() {
        return new Tile(this.id, rotate(this.data, 2));
    }

    rotate270() {
        return new Tile(this.id, rotate(this.data, 3));
    }
}

const tiles = input.map(Tile.parse)

let allTransforms = ti => _.chain([ti, ti.flipH()]).map(ti => [ti, ti.rotate90(), ti.rotate180(), ti.rotate270()]).flatten().value();

const part1 = _.chain(tiles)
.filter((tile) => {
    return _.chain(tiles)
    .filter(t => t !== tile)
    .map(allTransforms)
    .flatten()
    .filter(t => t.top      === tile.bottom
                || t.bottom === tile.top
                || t.left   === tile.right
                || t.right  === tile.left 
                )
    .size()
    .value() === 2
})
.reduce((acc, t) => acc * t.id, 1)
.value();

console.log("part1: " + part1)