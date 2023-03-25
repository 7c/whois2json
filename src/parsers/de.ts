import { IrawParser } from "../interfaces"
import { CParser } from "./super/CParser"
import { domainStatus } from "../types"
import dbg from "debug"
const debug = dbg("parser:de")

export class parser_de extends CParser implements IrawParser {
    isFree() {
        const data = this.data
        for (let l of data.byline) 
            if (l.startsWith(`Status: free`)) return true
        return false
    }

    isReserved(): boolean {
        // to implement
        return false
    }
    
    isRegistered(): boolean {
        const data = this.data
        for (let l of data.byline) {
            if (!l.startsWith(`Status: free`) && l.search(/^Status: /) === 0) return true
        }
        return false
    }

    parseRegistrar(): string | null {
        return "DENIC"
    }

    parseUpdateDate(): Date | boolean {
        const data = this.data
        for (let l of data.byline)
            if (l.search(/^Changed:/) == 0)
                return new Date(l.split('Changed:')[1].trim())
        return false
    }

    parseExpiration(): Date | boolean {
        return false
    }

    parseStatus():domainStatus[] {
        const data = this.data
        let status: domainStatus[] = []
        for (let l of data.byline)
            if (l.search(/^Status:/) == 0) {
                const s = l.split('Status:')[1].trim()
                if (s==='connect') status.push(domainStatus.ok)
            }
        return status
    }

    parseCreationDate(): Date | boolean {
        return false
    }

    parseNameservers(): string[] {
        const data = this.data
        let nameservers = []
        for (let l of data.byline)
            if (l.search(/^Nserver:/) == 0)
                nameservers.push(l.split(':')[1].trim().toLowerCase());
        return nameservers
    }
}