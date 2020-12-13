const _ = require("lodash");
const fs = require("fs");

const lines = fs.readFileSync("./day13.input", 'utf8').trim().split("\n");

const earliest = parseInt(lines[0])
const part1 = _.chain(lines[1].split(","))
.filter(i => i !== 'x')
.map(i => parseInt(i))
.map(id => { return {id: id, time:( id - (earliest % id))} })
.sortBy(b => b.time)
.map(b => b.id * b.time)
.first()
.value();

console.log("part1: " + part1);