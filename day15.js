const _ = require("lodash");
const fs = require("fs");

let input = [16,11,15,0,1,7];

function solve(length) {
  let lastCache = new Map();
  let nextLastCache = new Map();
  _.forEach(input, (v, i) => nextLastCache.set(v, i));
  
  let turn = input.length
  function addToCache(i) {
    if (lastCache.has(i)) {
      nextLastCache.set(i, lastCache.get(i));
    }

    lastCache.set(i, turn)
    last = i;
  }

  let last = _.last(input)
  for (; turn < length; turn++) {
      let lastOccurance = lastCache.get(last);
      let nextLastOccurance = nextLastCache.get(last);

      if (lastOccurance === undefined || nextLastOccurance === undefined) {
        addToCache(0)
        continue;
      }

      let next = lastOccurance - nextLastOccurance;
      addToCache(next);

      if (turn === 2019) {
        console.log("part1: " + last);
      }
  }

  return last;
}

const part2 = solve(30000000);

console.log("part2: " + part2);
