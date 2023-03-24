const { parseDomain } = require("whoisserver-world");
const { rawWhois, parseWhois } = require("./src/tools");



function whois2json(hostname) {
    let raw = rawWhois(hostname)
    if (typeof raw==='boolean') return false
    return parseWhois(raw)
}

module.exports = {
    whois2json,
    parseDomain
}