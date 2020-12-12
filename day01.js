const _ = require("lodash");
const fs = require("fs");
const { filter } = require("lodash");

var lines = fs.readFileSync("./day01.input", 'utf8').split('\n').map(i => +i);

_.chain(lines).forEach(
    (val, ind, coll) => {
        _.forEach(coll, (val1, ind1, coll1) => {
            var first = _.find(coll1, j => val + j + val1 === 2020);
            if (first) console.log(first * val * val1);
        })
})
.value();