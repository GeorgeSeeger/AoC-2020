const _ = require("lodash");
const fs = require("fs");

const input = fs.readFileSync("./day21.input", "utf-8").trim().split("\n").map(line => {
    let data = /(.+) \(contains (.+)\)/.exec(line);
    let ingredients = data[1].split(" ");
    let allergens = data[2].split(", ");
    return [ ingredients, allergens]
});

const confirmed = {};
const potential = {};
function confirmSinglesInPotentials() {
    _.chain(potential)
    .pickBy(ings => ings.length === 1) 
    .forEach((ings, agn) => {
        let confirmedAgn = ings[0]
        confirmed[agn] = confirmedAgn;

        _.forEach(potential, agns => {
            _.pull(agns, confirmedAgn);
        })
    })
    .value();
}
_.forEach(input, data => {
    let ingredients = data[0]
    let allergens = data[1]
    allergens.forEach(agn => {
        if (_.has(confirmed, agn)) {
            _.pull(ingredients, confirmed[agn])
        }
    })

    allergens.forEach(agn => {
        if (_.has(potential, agn)) {
            potential[agn] = _.intersection(potential[agn], ingredients)
            confirmSinglesInPotentials()
        } else {
            potential[agn] = ingredients;
        }
    })
})
confirmSinglesInPotentials();

const part1 = _.chain(input)
.map(data => data[0])
.map(ingredients => _.reject(ingredients, ing => 
                           _.includes(confirmed, ing)
                        || _.some(potential, ings => ings.includes(ing))))
.flatten()
.size()
.value();

console.log("part1: " + part1);

const part2 = _.chain(confirmed)
.toPairs()
.sortBy(d => d[0])
.map(i => i[1])
.value()
.join(",")

console.log("part2: " + part2);