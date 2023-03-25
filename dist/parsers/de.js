"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser_de = void 0;
const CParser_1 = require("./super/CParser");
const types_1 = require("../types");
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)("parser:de");
class parser_de extends CParser_1.CParser {
    isFree() {
        const data = this.data;
        for (let l of data.byline)
            if (l.startsWith(`Status: free`))
                return true;
        return false;
    }
    isReserved() {
        // to implement
        return false;
    }
    isRegistered() {
        const data = this.data;
        for (let l of data.byline) {
            if (!l.startsWith(`Status: free`) && l.search(/^Status: /) === 0)
                return true;
        }
        return false;
    }
    parseRegistrar() {
        return "DENIC";
    }
    parseUpdateDate() {
        const data = this.data;
        for (let l of data.byline)
            if (l.search(/^Changed:/) == 0)
                return new Date(l.split('Changed:')[1].trim());
        return false;
    }
    parseExpiration() {
        return false;
    }
    parseStatus() {
        const data = this.data;
        let status = [];
        for (let l of data.byline)
            if (l.search(/^Status:/) == 0) {
                const s = l.split('Status:')[1].trim();
                if (s === 'connect')
                    status.push(types_1.domainStatus.ok);
            }
        return status;
    }
    parseCreationDate() {
        return false;
    }
    parseNameservers() {
        const data = this.data;
        let nameservers = [];
        for (let l of data.byline)
            if (l.search(/^Nserver:/) == 0)
                nameservers.push(l.split(':')[1].trim().toLowerCase());
        return nameservers;
    }
}
exports.parser_de = parser_de;
