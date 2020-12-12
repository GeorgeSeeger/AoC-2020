const _ = require("lodash");
const fs = require("fs");

const lines = fs.readFileSync("./day04.input", 'utf8')
                .split("\n\n");

const passports = lines.map(pp => _.fromPairs(pp.split(/[\s|\n]/).map(li => li.split(":"))))
const eyes = { amb: 0, blu: 0, brn:0, gry:0, grn:0,hzl:0,oth:0};
const validFields = {
    "byr": i => 1920 <= +i && +i <= 2002,
    "iyr": i => 2010 <= +i && +i <= 2020,
    "eyr": i => 2020 <= +i && +i <= 2030,
    "hgt": i => {
        var res = /^(\d+)(cm|in)$/.exec(i)
        return res && (res[2] === "cm" 
        ? 150 <= +res[1] && +res[1] <= 193
        : 59 <= +res[1] && +res[1] <= 76)
    } ,
    "hcl": i => /^#[\da-f]{6}$/.test(i),
    "ecl": i => eyes.hasOwnProperty(i),
    "pid": i => /^\d{9}$/.test(i),
    };

const part1 = _.chain(passports)
               .filter(pp => _.every(validFields, (valid, f) => pp.hasOwnProperty(f)))
               .size()
               .value();

console.log("part1: " + part1);

const part2 = passports.filter(pp => _.every(validFields, (isValid, f) => 
    pp.hasOwnProperty(f) && isValid(pp[f]))
).length;
console.log("part2: " + part2);
