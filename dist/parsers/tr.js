"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser_tr = void 0;
const CParser_1 = require("./super/CParser");
const debug_1 = __importDefault(require("debug"));
const mybase_1 = require("mybase");
const debug = (0, debug_1.default)("parser:at");
class parser_tr extends CParser_1.CParser {
    isFree() {
        const data = this.data;
        for (let l of data.byline)
            if (l.startsWith(`No match found for`))
                return true;
        return false;
    }
    isReserved() {
        // to implement
        return false;
    }
    isRegistered() {
        const domain = this.data.parsedHostname.domain;
        return this.data.raw.startsWith(`** Domain Name: ${domain}\n`);
    }
    isInvalid() {
        return this.data.raw === 'Invalid input';
    }
    parseNameservers() {
        const data = this.data;
        let nameservers = [];
        let nsi = this.findIndexStarting("** Domain Servers:");
        if (nsi < 0)
            return nameservers;
        for (let i = nsi + 1; i < this.totalLines(); i++) {
            if (data.byline[i].trim() === '')
                break;
            if ((0, mybase_1.validHostname)(data.byline[i]))
                nameservers.push(data.byline[i].toLowerCase());
        }
        return nameservers;
    }
    parseRegistrar() {
        const data = this.data;
        let nsi = this.findIndexStarting("** Registrar:");
        if (nsi < 0)
            return null;
        for (let i = nsi + 1; i < this.totalLines(); i++) {
            if (data.byline[i].trim() === '')
                break;
            if (data.byline[i].startsWith("Organization Name\t:"))
                return data.byline[i].split(':')[1].trim();
        }
        return null;
    }
    parseUpdateDate() {
        // not available within .tr domains
        return false;
    }
    parseExpiration() {
        for (let l of this.data.byline)
            if (l.startsWith(`Expires on....`))
                return new Date(l.split(':')[1].trim());
        return false;
    }
    parseStatus() {
        return [];
    }
    parseCreationDate() {
        for (let l of this.data.byline)
            if (l.startsWith(`Created on....`))
                return new Date(l.split(':')[1].trim());
        return false;
    }
}
exports.parser_tr = parser_tr;
