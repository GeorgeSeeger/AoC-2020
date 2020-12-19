const _ = require("lodash");
const fs = require("fs");

const input = fs.readFileSync("./day19.input", "utf-8").trim().split("\n\n");
const part2ify = s => s.replace("8: 42", "8: 42 | 42 8")
                       .replace("11: 42 31", "11: 42 31 | 42 11 31");

function compileRuleToRegex(id) {
    
    const ruleData = _.chain(input[0].split("\n"))
    .map(str => str.split(": "))
    .sortBy(str => +str[0])
    .map(s => {
        if (s[1].match(/\"[ab]\"/)) {
            const chr = s[1][1]
            return [s[0], chr]
        } else {
            return [s[0], s[1].split(" | ").map(s => s.split(" ").map(i => +i))];
        }
    })
    .fromPairs()
    .value();

    return compileRuleToRegexInner(id);

    function compileRuleToRegexInner(id) {
        let rule = ruleData[id]
        if (typeof rule === "string") {
            return rule; 
        }

        let regex;
        if (rule.every(ids => ids.every(i => i !== id))) {
            regex = rule.map(ids => {
                return ids.map(id => `(?:${compileRuleToRegexInner(id)})`).join("");
            }).join("|");

        } else {// loopy town
            let baseCase = rule.find(ids => ids.every(i => i !== id))
            if (rule.some(ids => _.last(ids) === id)) {
                regex = baseCase.map(id => `(?:${compileRuleToRegexInner(id)})`).join("") + "+";
            } else {
                let a = compileRuleToRegexInner(baseCase[0])
                let b = compileRuleToRegexInner(baseCase[1]);
                regex = "(?:" + _.range(1,10).map(ct => `(?:${a}){${ct}}(?:${b}){${ct}}`).join("|") + ")";
            }

        }
        ruleData[id] = regex
        return regex;
    }
}

function solve() {
    const rule0 = new RegExp("^" + compileRuleToRegex(0) + "$");
    return _.chain(input[1].split("\n"))
    .filter(c => rule0.test(c))
    .size()
    .value();
}

const part1 = solve();

console.log("part1: " + part1);

input[0] = part2ify(input[0]);

const part2 = solve();

console.log("part2: " + part2);