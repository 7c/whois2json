"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CParser = void 0;
const types_1 = require("./../../types");
class CParser {
    constructor(data) {
        this.data = data;
    }
    findIndexStarting(startingWith) {
        for (let i = 0; i < this.data.byline.length; i++)
            if (this.data.byline[i].startsWith(startingWith))
                return i;
        return -1;
    }
    totalLines() {
        return this.data.byline.length;
    }
    parseStatusCom() {
        const data = this.data;
        let status = [];
        for (let l of data.byline) {
            if (l.startsWith(`Domain Status: clientTransferProhibited`))
                status.push(types_1.domainStatus.clientTransferProhibited);
            if (l.startsWith(`Domain Status: redemptionPeriod`))
                status.push(types_1.domainStatus.redemptionPeriod);
            if (l.startsWith(`Domain Status: clientDeleteProhibited`))
                status.push(types_1.domainStatus.clientDeleteProhibited);
            if (l.startsWith(`Domain Status: serverTransferProhibited`))
                status.push(types_1.domainStatus.serverTransferProhibited);
            if (l.startsWith(`Domain Status: serverDeleteProhibited`))
                status.push(types_1.domainStatus.serverDeleteProhibited);
            if (l.startsWith(`Domain Status: clientUpdateProhibited`))
                status.push(types_1.domainStatus.clientUpdateProhibited);
            if (l.startsWith(`Domain Status: ok`))
                status.push(types_1.domainStatus.ok);
        }
        return status;
    }
}
exports.CParser = CParser;
