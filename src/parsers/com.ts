import { IrawParser } from "../interfaces";
import { CParser } from "./super/CParser";
import dbg from "debug"
import { domainStatus } from "../types";
import { validHostname } from "mybase"
const debug = dbg("parser:com")

export class parser_com extends CParser implements IrawParser {
    isFree() {
        const data = this.data
        //
        // biz
        if (data.raw.search(/^No Data Found\r\n/) === 0) return true
        // life
        if (data.raw.search(/^Domain not found.\r\n/) === 0) return true
        // fun, pics
        if (data.raw.search(/^The queried object does not exist: DOMAIN NOT FOUND\r\n/) === 0) return true
        // top
        if (data.raw.search(/^The queried object does not exist:/) === 0) return true

        for (let l of data.byline) {
            // com,net,org,info
            if (l.startsWith(`No match for domain \"${data.hostname.toUpperCase()}\"`)) return true
            // No match for "BURNER-CELL4S.CC".
            if (l.startsWith(`No match for \"${data.hostname.toUpperCase()}\"`)) return true
        }
        return false
    }

    isReserved(): boolean {
        for (let l of this.data.byline) {
            // .live
            if (l.startsWith(`The registration of this domain is restricted, as it is protected`)) return true
            if (l.startsWith(`This domain has been reserved by the registry`)) return true
        }
        return false
    }

    isRegistered(): boolean {
        const data = this.data
        for (let l of data.byline) {
            if (l.search(/Registrar IANA ID/) === 0) return true
        }
        return false
    }

    parseRegistrar(): string | null {
        const data = this.data
        for (let l of data.byline)
            if (l.search(/^Registrar:/) == 0)
                return l.split('Registrar:')[1].trim()
        return null
    }

    parseUpdateDate(): Date | boolean {
        const data = this.data
        for (let l of data.byline)
            if (l.search(/^Updated Date:/) == 0)
                return new Date(l.split('Date:')[1].trim())
        return false
    }

    parseExpiration(): Date | boolean {
        const data = this.data
        for (let l of data.byline)
            if (l.search(/^Registry Expiry Date:/) == 0)
                return new Date(l.split('Date:')[1].trim())
        return false
    }

    parseStatus(): domainStatus[] {
        return this.parseStatusCom()
    }

    parseCreationDate(): Date | boolean {
        const data = this.data
        for (let l of data.byline)
            if (l.search(/^Creation Date:/) == 0)
                return new Date(l.split('Date:')[1].trim())
        return false
    }

    parseNameservers(): string[] {
        const data = this.data
        let nameservers = []
        for (let l of data.byline)
            if (l.search(/^Name Server:/) == 0)
             {
                const nsRight = l.split(':')[1].trim().toLowerCase()
                if (validHostname(nsRight)) nameservers.push(nsRight)
             }
                
        return nameservers
    }
}