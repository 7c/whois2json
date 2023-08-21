import { IrawParser } from "../interfaces";
import { CParser } from "./super/CParser";
import dbg from "debug"
import { domainStatus } from "../types";
import { validHostname } from "mybase"
const debug = dbg("parser:eu")

export class parser_ai extends CParser implements IrawParser {
    isFree() {
        const data = this.data
        for (let l of data.byline) 
            if (l.startsWith(`Domain Status: No Object Found`)) return true
        return false
    }

    isRegistered(): boolean {
        const data = this.data
        for (let l of data.byline) {
            console.log(`>>`,l)
            if (l.search(/Registry RegistrantID:/) === 0) return true
        }
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

    isReserved(): boolean {
        // to implement
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
        return false
    }

    parseExpiration(): Date | boolean {
        return false
    }

    parseStatus(): domainStatus[] {
        return []
    }

    parseCreationDate(): Date | boolean {
        const data = this.data
        for (let l of data.byline)
            if (l.search(/^Creation Date:/) == 0)
                return new Date(l.split('Date:')[1].trim())
        return false
    }

   
}