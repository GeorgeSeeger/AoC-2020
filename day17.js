const _ = require("lodash");
const fs = require("fs");

let input = fs.readFileSync("./day17.input", "utf-8").trim().split("\n")

function solve(input, n, numCycles) {
    if (n <= 2) throw '2D or more only'

    let dimLimits = getNDimensionLimits(n);
        
    function getNDimensionLimits(n) {
        return Array.from({length: n}, () => { return { min: 0, max: 0}})
    }
    
    let inputState = _.reduce(input, (accSet, str, y) => {
        let baseKey = new Array(n - 2).fill(0);
        _.forEach(str, (ch, x) => {
            if (ch === '#') {
                let coords = baseKey.concat(y, x);
                let key = getKey(coords);
                assignLimits(coords);
                accSet.add(key);
            } 
        })
        return accSet;
    }, new Set());

    function getNDimensionCoords(dimensionLimits) {
        return _.chain(dimensionLimits)
        .map(lim => _.range(lim.min - 1, lim.max + 2))
        .reduce((acc, coords) => 
                _.flatten(_.map(coords, c => _.map(acc, a => a.concat(c))))
            , [[]])
        .value();
    }

    function getKey(coords) {
        return coords.join("|");
    }

    function assignLimits(coords) {
        _.forEach(coords, (v, i) => {
            dimLimits[i].min = Math.min(dimLimits[i].min, v);
            dimLimits[i].max = Math.max(dimLimits[i].max, v);
        })
    }

    function getNextState(state) {
        let nextState = new Set(state);

        _.forEach(getNDimensionCoords(dimLimits), (coords) => {
            let activeCount = _.size(_.filter(getNeighbours(coords), b => b));

            if (isActive(coords)) {
                if (activeCount < 2 || activeCount > 3) {
                    setInactive(coords);
                }
            } else {
                if (activeCount === 3) {
                    setActive(coords);
                }
            }
        })

        return nextState;
        
        function setActive(coords) {
            nextState.add(getKey(coords));
            assignLimits(coords);
        }

        function setInactive(coords) {
            nextState.delete(getKey(coords));
            assignLimits(coords);
        }
    }

    function getNeighbours(coords) {
       let lims = _.map(coords, c => { return { min: c, max: c}})

       let neighbourCoords = _.reject(getNDimensionCoords(lims), c => _.isMatch(c, coords));
       return _.map(neighbourCoords, isActive) 
    }

    function isActive(coords) {
        return inputState.has(getKey(coords))
    }

    for (let i of _.range(numCycles)) {
        inputState = getNextState(inputState);
    }

    return _.size(inputState);
}

console.log("part1: " + solve(input, 3, 6));

console.log("part2: " + solve(input, 4, 6))