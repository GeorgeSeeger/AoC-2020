const _ = require("lodash");
const fs = require("fs");

const lines = fs.readFileSync("./day14.test.input", 'utf8').trim().split("\n");

const part1 = (function() {
  let mask = {};
  let memory = {};

  const applyMask = (input) => {
    return (input & mask.zerosMask) | mask.onesMask;
  }

  const parseMask = (maskInput) => {
    let onesMask = 0n;
    let zerosMask = 0n;
    _.forEach(maskInput, (bit, index) => {
      onesMask <<= 1n;
      zerosMask <<= 1n;

      if (bit === "1") onesMask |= 1n;
      if (bit !== "0") zerosMask |= 1n;

    });
    mask.onesMask = onesMask;
    mask.zerosMask = zerosMask;
  }

  _.forEach(lines, line => {
    if (line.startsWith("mask")) {
      parseMask(line.trim().split(" = ")[1].split(""));
    } else {
      let args = /\[(\d+)\] = (\d+)/.exec(line);
      memory[args[1]] = applyMask(BigInt(parseInt(args[2])));
    }
  })

  return _.sum(_.values(memory));
})()

console.log("part1: " + part1)