const _ = require("lodash");
const fs = require("fs");

const lines = fs.readFileSync("./day8.input", 'utf8').split("\n");

function makeInstrs(data) {
  return {
    nop: () => {data.ptr++},
    acc: (i) => {data.ptr++; data.acc += parseInt(i)},
    jmp: (i) => {data.ptr += parseInt(i)}
  }
}

const accValueAtInfiniteLoop = (function (program) {
  var memory = { acc: 0, ptr: 0 };
  var instrs = makeInstrs(memory);
  var listOfPtrs = {};
  while (!listOfPtrs[memory.ptr]) {
    listOfPtrs[memory.ptr] = true;
    var instr = program[memory.ptr].split(" ");
    instrs[instr[0]].call(null, instr[1]);
  }
  return memory.acc;
});

const part1 = accValueAtInfiniteLoop(lines);


console.log("part1: " + part1);