"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser_at = void 0;
const CParser_1 = require("./super/CParser");
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)("parser:at");
class parser_at extends CParser_1.CParser {
    isFree() {
        const data = this.data;
        for (let l of data.byline)
            if (l.startsWith(`% nothing found`))
                return true;
        return false;
    }
    isReserved() {
        // to implement
        return false;
    }
    isRegistered() {
        const data = this.data;
        for (let l of data.byline)
            if (l.search(/registrar:/) === 0)
                return true;
        return false;
    }
    parseNameservers() {
        const data = this.data;
        let nameservers = [];
        for (let l of data.byline)
            if (l.search(/^nserver:/) == 0)
                nameservers.push(l.split(':')[1].trim().toLowerCase());
        return nameservers;
    }
    parseRegistrar() {
        const data = this.data;
        for (let l of data.byline)
            if (l.search(/^registrar:/) == 0)
                return l.split('registrar:')[1].trim();
        return null;
    }
    parseUpdateDate() {
        return false;
    }
    isInvalid() {
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
exports.parser_at = parser_at;
