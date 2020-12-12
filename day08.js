const _ = require("lodash");
const fs = require("fs");

const lines = fs.readFileSync("./day08.input", 'utf8').trim().split("\n");

function makeInstrs(data) {
  return {
    nop: () => {data.ptr++},
    acc: (i) => {data.ptr++; data.acc += parseInt(i)},
    jmp: (i) => {data.ptr += parseInt(i)}
  }
}

const execute = (function (program, completion, infLoop) {
  var memory = { acc: 0, ptr: 0 };
  var instrs = makeInstrs(memory);
  var listOfPtrs = {};
  while (!listOfPtrs[memory.ptr]) {
    listOfPtrs[memory.ptr] = true;
    if (memory.ptr >= program.length) {
      return completion.call(null, memory);
    }
    var instr = program[memory.ptr].split(" ");
    instrs[instr[0]].call(null, instr[1]);
  }
  return infLoop.call(null, memory);
});

const part1 = execute(lines, () => null, (m) => m.acc);

console.log("part1: " + part1);

const part2 = _.chain(lines)
  .map((instr, index, program) => {
    if (instr.startsWith("acc")) return false;
    var newCode = _.clone(program);
    newCode[index] = instr.startsWith("jmp") 
                    ? instr.replace("jmp", "nop")
                    : instr.replace("nop", "jmp")
    return newCode;
  })
  .compact()
  .map(prog => execute(prog, m => m.acc, () => false))
  .compact()
  .first()
  .value();

console.log("part2: " + part2);