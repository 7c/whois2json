"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseWhois = exports.rawWhois = void 0;
const chalk_1 = __importDefault(require("chalk"));
const minimist_1 = __importDefault(require("minimist"));
const com_1 = require("./parsers/com");
const whois_1 = __importDefault(require("whois"));
const debug_1 = __importDefault(require("debug"));
const whoisserver_world_1 = require("whoisserver-world");
const de_1 = require("./parsers/de");
const eu_1 = require("./parsers/eu");
const gg_1 = require("./parsers/gg");
const ai_1 = require("./parsers/ai");
const at_1 = require("./parsers/at");
const tr_1 = require("./parsers/tr");
const debug = (0, debug_1.default)("tools");
const argv = (0, minimist_1.default)(process.argv.slice(2));
function rawWhois(hostname) {
    debug(`rawWhois(${hostname})`);
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            let parsedHostname = (0, whoisserver_world_1.parseDomain)(hostname); // get the domainpart
            if (!parsedHostname) {
                debug(`invalid domain`);
                return resolve(false);
            }
            let domain = parsedHostname.domain;
            let tld = parsedHostname.tld;
            let whoisOptions = {
                follow: 0,
                server: "",
            };
            // we update whoisserver from whoisserver-world for certain tlds
            if (['ooo', 'tv', 'zip', 'zero'].includes(tld)) {
                let whoisServer = parsedHostname.tldData.whoisServer;
                if (Array.isArray(whoisServer) && whoisServer.length > 0)
                    whoisOptions['server'] = whoisServer[0];
            }
            // console.log(whoisOptions)
            // let parsed = psl.parse(domain)
            // console.log(domain)
            whois_1.default.lookup(domain, whoisOptions, (err, raw) => {
                if (err)
                    return resolve(false);
                let byline = raw.split(/\n/);
                let byline_sanitized = [];
                for (let line of byline) {
                    line = line.trim();
                    line = line.replace(/\r$/, '');
                    byline_sanitized.push(line);
                }
                let resultat = {
                    hostname,
                    parsedHostname: parsedHostname,
                    raw,
                    byline: byline_sanitized
                };
                return resolve(resultat);
            });
        });
    });
}
exports.rawWhois = rawWhois;
function parseWhois(data) {
    debug("parseWhois");
    if (typeof data === 'object') {
        const tld = data.parsedHostname.tld;
        debug(`tld:${tld}`);
        let parser;
        if (argv.scan) {
            for (let p of [
                new com_1.parser_com(data),
                new de_1.parser_de(data),
                new ai_1.parser_ai(data),
                new gg_1.parser_gg(data),
                new eu_1.parser_eu(data),
                new at_1.parser_at(data)
            ]) {
                if (p.isRegistered() || p.isFree() || p.isReserved()) {
                    console.log(chalk_1.default.blue.inverse(`scanned ${tld} and found ${p.constructor.name}`));
                    parser = p;
                    break;
                }
            }
        }
        // com,net,org,info,biz very similar raw data
        if (tld === 'com' ||
            tld === 'net' ||
            tld === 'org' ||
            tld === 'biz' ||
            tld === 'life' ||
            tld === 'fun' ||
            tld === 'pics' ||
            tld === 'top' ||
            tld === 'world' ||
            tld === 'site' ||
            tld === 'zip' ||
            tld === 'io' ||
            tld === 'us' ||
            tld === 'ooo' ||
            tld === 'tv' ||
            tld === 'cc' ||
            tld === 'xyz' ||
            tld === 'pro' ||
            tld === 'live' ||
            tld === 'me' ||
            tld === 'motorcycles' ||
            tld === 'info')
            parser = new com_1.parser_com(data);
        if (tld === 'de')
            parser = new de_1.parser_de(data);
        if (tld === 'ai')
            parser = new ai_1.parser_ai(data);
        if (tld === 'eu')
            parser = new eu_1.parser_eu(data);
        if (tld === 'gg')
            parser = new gg_1.parser_gg(data);
        if (tld === 'at')
            parser = new at_1.parser_at(data);
        if (tld === 'tr')
            parser = new tr_1.parser_tr(data);
        if (!parser)
            return false;
        // domain is invalid
        if (parser.isInvalid()) {
            let ret = {
                outcome: "invalid",
                domain: data.hostname.toLowerCase(),
                tld: data.parsedHostname.tldData.tld,
            };
            return ret;
        }
        // domain is free
        if (parser.isFree()) {
            let ret = {
                outcome: "free",
                domain: data.hostname.toLowerCase(),
                tld: data.parsedHostname.tldData.tld,
            };
            return ret;
        }
        // domain is reserved, TODO
        if (parser.isReserved()) {
            let ret = {
                outcome: "reserved",
                domain: data.hostname.toLowerCase(),
                tld: data.parsedHostname.tldData.tld,
            };
            return ret;
        }
        // domain is registered
        if (parser.isRegistered()) {
            let ret = {
                outcome: "registered",
                domain: data.parsedHostname.domain.toLowerCase(),
                tld: data.parsedHostname.tldData.tld,
                nameservers: parser.parseNameservers(),
                dates: {
                    expiration: parser.parseExpiration(),
                    created: parser.parseCreationDate(),
                    updated: parser.parseUpdateDate()
                },
                status: parser.parseStatus(),
                registrar: {
                    name: parser.parseRegistrar()
                }
            };
            return ret;
        }
    }
    // error
    return false;
}
exports.parseWhois = parseWhois;
