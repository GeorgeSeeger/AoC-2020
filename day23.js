const _ = require("lodash");

const input = '624397158'.split("").map(i => +i);

let moves = 100;

function playGame(cups, moves, topUpTo) {
    let current = _.first(cups);

    let limit = topUpTo || _.last(cups);
    let max = topUpTo || Math.max(...cups);
    let pointerLookup = input.reduce((acc, v, i, c) => {
        acc[v] = i < c.length - 1 ? c[i+1] : c.length + 1
        return acc;
    }, {});
    
    pointerLookup[limit] = _.first(cups); // loop it back on itself

    let find = n => {
        if (_.has(pointerLookup, n)) return pointerLookup[n];
        
        return (pointerLookup[n] = n + 1);
    }

    for (let i = 0; i < moves; i++) {
        let t = current;
        let pickUp = _.range(3).map(() => {
            let v = find(t);
            t = v;
            return v;
        });

        let destination = _.chain(_.range(current - 1, current - 4, -1))
        .concat(_.range(max, max - 3, -1))
        .reject(i => pickUp.includes(i))
        .reject(i => i < 1)
        .first().value();

        pointerLookup[current] = find(_.last(pickUp));
        pointerLookup[_.last(pickUp)] = find(destination);
        pointerLookup[destination] = _.first(pickUp);
        current = find(current);
    }

    return pointerLookup;
}

let lk = playGame(input, moves);
const part1 = input.reduce((acc, v, i, c) => {
    const next = i === 0 ? lk[1] : lk[acc[i - 1]];
    if (next === 1) return acc;
    acc.push(next)
    return acc;
}, []).join("");

console.log("part1: " + part1);

lk = playGame(input, 1e7, 1e6);
const part2 = lk[1] * lk[lk[1]]
console.log("part2: " + part2);