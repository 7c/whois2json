"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser_ai = void 0;
const CParser_1 = require("./super/CParser");
const debug_1 = __importDefault(require("debug"));
const mybase_1 = require("mybase");
const debug = (0, debug_1.default)("parser:eu");
class parser_ai extends CParser_1.CParser {
    isFree() {
        const data = this.data;
        for (let l of data.byline)
            if (l.startsWith(`Domain Status: No Object Found`))
                return true;
        return false;
    }
    isRegistered() {
        const data = this.data;
        for (let l of data.byline) {
            // console.log(`>>`,l)
            if (l.search(/Registry RegistrantID:/) === 0)
                return true;
        }
        return false;
    }
    parseNameservers() {
        const data = this.data;
        let nameservers = [];
        for (let l of data.byline)
            if (l.search(/^Name Server:/) == 0) {
                const nsRight = l.split(':')[1].trim().toLowerCase();
                if ((0, mybase_1.validHostname)(nsRight))
                    nameservers.push(nsRight);
            }
        return nameservers;
    }
    isReserved() {
        // to implement
        return false;
    }
    isInvalid() {
        return false;
    }
    parseRegistrar() {
        const data = this.data;
        for (let l of data.byline)
            if (l.search(/^Registrar:/) == 0)
                return l.split('Registrar:')[1].trim();
        return null;
    }
    parseUpdateDate() {
        return false;
    }
    parseExpiration() {
        return false;
    }
    parseStatus() {
        return [];
    }
    parseCreationDate() {
        const data = this.data;
        for (let l of data.byline)
            if (l.search(/^Creation Date:/) == 0)
                return new Date(l.split('Date:')[1].trim());
        return false;
    }
}
exports.parser_ai = parser_ai;
