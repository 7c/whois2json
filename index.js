const { parseDomain } = require("whoisserver-world");
const { rawWhois, parseWhois } = require("./dist/tools");

function whois2json(hostname) {
    return new Promise(async function (resolve,reject) {
        let raw = await rawWhois(hostname)
        if (typeof raw==='boolean') return resolve(false)
        return resolve(parseWhois(raw))
    })
}

module.exports = {
    whois2json,
    parseDomain,
    rawWhois,
    parseWhois
}