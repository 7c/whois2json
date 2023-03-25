import { IrawParser } from "../interfaces";
import { CParser } from "./super/CParser";
import dbg from "debug"
import { domainStatus } from "../types";
import { validHostname } from "mybase"
const debug = dbg("parser:at")

export class parser_at extends CParser implements IrawParser {
    isFree() {
        const data = this.data
        for (let l of data.byline) 
            if (l.startsWith(`% nothing found`)) return true
        return false
    }

    isReserved(): boolean {
        // to implement
        return false
    }

    isRegistered(): boolean {
        const data = this.data
        for (let l of data.byline) 
            if (l.search(/registrar:/) === 0) return true
        return false
    }

    parseNameservers(): string[] {
        const data = this.data
        let nameservers:string[]=[]
        for (let l of data.byline)
            if (l.search(/^nserver:/) == 0)
                nameservers.push(l.split(':')[1].trim().toLowerCase());
        return nameservers
    }

    parseRegistrar(): string | null {
        const data = this.data
        for (let l of data.byline)
            if (l.search(/^registrar:/) == 0)
                return l.split('registrar:')[1].trim()
        return null
    }

    parseUpdateDate(): Date | boolean {
        return false
    }

    parseExpiration(): Date | boolean {
        return false
    }

    parseStatus(): domainStatus[] {
        return []
    }

    parseCreationDate(): Date | boolean {
        return false
    }

   
}