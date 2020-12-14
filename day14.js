const _ = require("lodash");
const fs = require("fs");

let lines = fs.readFileSync("./day14.input", 'utf8').trim().split("\n");

function solve(parseMask, applyMask) {
  let memory = {};
  
  _.forEach(lines, line => {
    if (line.startsWith("mask")) {
      parseMask(line.trim().split(" = ")[1].split(""));
    } else {
      let args = /\[(\d+)\] = (\d+)/.exec(line);
      applyMask(memory, parseInt(BigInt(args[1])), BigInt(parseInt(args[2])));
    }
  })

  return _.sum(_.values(memory));
}

const part1 = (function() {
  let mask = {};

  const applyMask = (memory, address, input) => {
    memory[address] = (input & mask.zerosMask) | mask.onesMask;
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

  return solve(parseMask, applyMask);
})()

console.log("part1: " + part1)

const part2 = (function() {
  let mask = {};

  const parseMask = (maskInput) => {
    mask = {};
    mask.floatingMasks = [];
    mask.onesMask = 0n;

    const singleBitMasks = (shift) => {
      let onesMask = 1n << BigInt(shift);
      let zerosMask = 0b111111111111111111111111111111111111n ^ (1n << BigInt(shift));

      mask.floatingMasks.push({apply: i => BigInt(i) | onesMask })
      mask.floatingMasks.push({apply: i => BigInt(i) & zerosMask });
    }

    _.forEach(maskInput, (bit, index) => {
      mask.onesMask <<= 1n;

      if (bit === '1') mask.onesMask |= 1n;
      if (bit === 'X') singleBitMasks(maskInput.length - index - 1)
    });

    mask.apply = i => BigInt(i) | mask.onesMask;
  }

  const applyMask = (memory, address, input) => {
    let newAddress = mask.apply(address);
    _.chain(mask.floatingMasks)
    .chunk(2)
    .reduce((acc, fmPair) => {
      return _.chain(acc)
      .map(add => _.map(fmPair, fm => fm.apply(add)))
      .flatten()
      .value();
    }, [newAddress])
    .forEach(memAddress => {
      memory[memAddress] = input;
    })
    .value();
  };

  return solve(parseMask, applyMask);
})();

console.log("part2: " + part2);