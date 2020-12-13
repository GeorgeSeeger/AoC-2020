const _ = require("lodash");
const fs = require("fs");

const lines = fs.readFileSync("./day13.input", 'utf8').trim().split("\n");

const earliest = parseInt(lines[0])
const busIds = lines[1].split(",").map(i => parseInt(i));

const part1 = _.chain(busIds)
.reject(isNaN)
.map(id => { return {id: id, time:( id - (earliest % id))} })
.sortBy(b => b.time)
.map(b => b.id * b.time)
.first()
.value();

console.log("part1: " + part1);

const part2 = _.chain(busIds)
.map((i, ind) => isNaN(i) ? false : { id: BigInt(i), offset: BigInt(ind) })
.compact()
.reduce((acc, bus) => {
  if (bus.offset === 0n) {
    acc.multiple = bus.id;
    acc.start = bus.id;
    return acc;
  }

  let i = BigInt(0);
  for (i = acc.start;
      bus.id - (i % bus.id) !== (bus.offset % bus.id);
      i += acc.multiple) {}

  acc.start = i;
  acc.multiple *= bus.id;
  return acc;
}, {})
.value()
.start;

console.log("part2: " + part2);