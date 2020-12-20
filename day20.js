const _ = require("lodash");
const fs = require("fs");

const input = fs.readFileSync("./day20.input", "utf-8").trim().split("\n\n");

function rotate(array, n) {
    let len = array.length;
    const rot = [];
    for (let j = 0; j < array.length; j++) {
        let line = array[j];
        let lineLen = line.length;
        for (let i = 0; i < line.length; i++) {
            if (( n === 1 || n === 3) && !rot[i] 
               || n === 2 && !rot[j]) rot.push([]) 
            if (n === 1) {
                rot[i][j] = array[len - j - 1][i];
            }
            if (n === 2) {
                rot[j][i] = array[len - j - 1][lineLen - i - 1]
            }
            if (n === 3) {
                rot[i][j] = array[j][lineLen - i - 1];
            }
        }
    }
    return rot;
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


const image = (function() {
    const tiles = input.map(Tile.parse)

    let allTransforms = ti => _.chain([ti, ti.flipH()]).map(ti => [ti, ti.rotate90(), ti.rotate180(), ti.rotate270()]).flatten().value();

    let n = Math.sqrt(_.size(tiles));
    let image = Array.from({length: n}, () => Array.from({length: n}, () => null));

    let tileTransforms = _.flatten(tiles.map(allTransforms));
    
    let topCorner = _.find(tiles, tile => 
        _.chain(tileTransforms)
        .reject(t => t.id == tile.id)
        .every(t => t.bottom !== tile.top
            && t.right !== tile.left)
        .value());

    let removeTileFromPool = tile => _.remove(tileTransforms, t => t.id === tile.id);
    removeTileFromPool(topCorner);

    image[0][0] = topCorner;

    for (let j in image) {
        for (let i in image[j]) {
            if (j === '0' && i === '0') continue;
            let predicate = i !== '0' 
                    ? t => t.left === image[j][i - 1].right
                    : t => t.top === image[j - 1][0].bottom;
            let next = _.find(tileTransforms, predicate);
            removeTileFromPool(next);
            image[j][i] = next;
        }
    }

    return image;
})()

const part1 = [image[0][0], image[0][image.length - 1], image[image.length - 1][0], image[image.length - 1][image.length - 1]]
            .reduce((acc, t) => acc * t.id, 1);

console.log("part1: " + part1)

const imageData = _.chain(image)
                    .map(row => row.map(t => t.data
                                              .slice(1, t.data.length - 1)
                                              .map(line => line.slice(1, line.length - 1))))
                    .map(_.flatten)
                    .map(coll => coll.reduce((acc, line, i) => {
                        let newIndex = i % line.length;
                        if (!acc[newIndex]) acc[newIndex] = [];
                        acc[newIndex].push(line)
                        return acc;
                     }, []))
                     .map(coll => coll.map(_.flatten))
                     .flatten()
                    .value()

const seaMonster = [
"                  O ",
"O    OO    OO    OOO",
" O  O  O  O  O  O   "].map(l => 
    l.split("").map(c => c === "O" 
    ? { isMonster: c => c === "#", mark: c => "O" }
    : { isMonster: c => true, mark: c => c })
);

const allSeaMonsters = _.chain([seaMonster, flip(seaMonster, true, false)])
.map(sm => [ sm, rotate(sm, 1), rotate(sm, 2), rotate(sm, 3)])
.flatten()
.value();

for (let sm of allSeaMonsters) {
    for (let j = 0; j < imageData.length - sm.length; j++) {
        for (let i = 0; i < imageData[0].length - sm[0].length; i++) {
            
            let isSeaMonster = sm.every((smLine, m) => smLine.every((smCell, n) => {
                return smCell.isMonster(imageData[j + m][i + n]);
            }));

            if (isSeaMonster) {
                sm.forEach((smLine, m) => smLine.forEach((smCell, n) => {
                    imageData[j + m][i + n] = smCell.mark(imageData[j + m][i + n]);
                }));
            }
        }

    }
}

const part2 = _.chain(imageData).flatten().filter(c => c === "#").size().value();
                  
console.log("part2: " + part2);