"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser_com = void 0;
const CParser_1 = require("./super/CParser");
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)("parser:com");
class parser_com extends CParser_1.CParser {
    isFree() {
        const data = this.data;
        // biz
        if (data.raw.search(/^No Data Found\r\n/) === 0)
            return true;
        // life
        if (data.raw.search(/^Domain not found.\r\n/) === 0)
            return true;
        // fun, pics
        if (data.raw.search(/^The queried object does not exist: DOMAIN NOT FOUND\r\n/) === 0)
            return true;
        // top
        if (data.raw.search(/^The queried object does not exist:/) === 0)
            return true;
        for (let l of data.byline) {
            // com,net,org,info
            if (l.startsWith(`No match for domain \"${data.hostname.toUpperCase()}\"`))
                return true;
        }
        return false;
    }
    isRegistered() {
        const data = this.data;
        for (let l of data.byline) {
            if (l.search(/Registrar IANA ID/) === 0)
                return true;
        }
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
        const data = this.data;
        for (let l of data.byline)
            if (l.search(/^Updated Date:/) == 0)
                return new Date(l.split('Date:')[1].trim());
        return false;
    }
    parseExpiration() {
        const data = this.data;
        for (let l of data.byline)
            if (l.search(/^Registry Expiry Date:/) == 0)
                return new Date(l.split('Date:')[1].trim());
        return false;
    }
    parseStatus() {
        return this.parseStatusCom();
    }
    parseCreationDate() {
        const data = this.data;
        for (let l of data.byline)
            if (l.search(/^Creation Date:/) == 0)
                return new Date(l.split('Date:')[1].trim());
        return false;
    }
    parseNameservers() {
        const data = this.data;
        let nameservers = [];
        for (let l of data.byline)
            if (l.search(/^Name Server:/) == 0)
                nameservers.push(l.split(':')[1].trim().toLowerCase());
        return nameservers;
    }
}
exports.parser_com = parser_com;
