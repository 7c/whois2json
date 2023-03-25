"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser_eu = void 0;
const CParser_1 = require("./super/CParser");
const debug_1 = __importDefault(require("debug"));
const mybase_1 = require("mybase");
const debug = (0, debug_1.default)("parser:eu");
class parser_eu extends CParser_1.CParser {
    isFree() {
        const data = this.data;
        for (let l of data.byline)
            if (l.startsWith(`Status: AVAILABLE`))
                return true;
        return false;
    }
    isRegistered() {
        const data = this.data;
        for (let l of data.byline) {
            if (l.search(/Registrar:/) === 0)
                return true;
        }
        return false;
    }
    parseNameservers() {
        const data = this.data;
        let nameservers = [];
        let nsi = this.findIndexStarting("Name servers:");
        if (nsi < 0)
            return nameservers;
        for (let i = nsi; i < this.totalLines(); i++) {
            if (data.byline[i].trim() === '')
                break;
            if ((0, mybase_1.validHostname)(data.byline[i]))
                nameservers.push(data.byline[i].toLowerCase());
        }
        return nameservers;
    }
    isReserved() {
        // to implement
        return false;
    }
    parseRegistrar() {
        const data = this.data;
        let nsi = this.findIndexStarting("Registrar:");
        if (nsi < 0)
            return null;
        for (let i = nsi; i < this.totalLines(); i++) {
            if (data.byline[i].trim() === '')
                break;
            if (data.byline[i].startsWith("Name:"))
                return data.byline[i].split('Name:')[1].trim();
        }
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
        return false;
    }
}
exports.parser_eu = parser_eu;
