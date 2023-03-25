import { IrawParser } from "../interfaces";
import { CParser } from "./super/CParser";
import dbg from "debug"
import { domainStatus } from "../types";
import { validHostname } from "mybase"
const debug = dbg("parser:eu")

export class parser_eu extends CParser implements IrawParser {
    isFree() {
        const data = this.data
        for (let l of data.byline) 
            if (l.startsWith(`Status: AVAILABLE`)) return true
        return false
    }

    isRegistered(): boolean {
        const data = this.data
        for (let l of data.byline) {
            if (l.search(/Registrar:/) === 0) return true
        }
        return false
    }

    parseNameservers(): string[] {
        const data = this.data
        let nameservers:string[]=[]
        let nsi = this.findIndexStarting("Name servers:")
        if (nsi<0) return nameservers
        for(let i=nsi;i<this.totalLines();i++) {
            if (data.byline[i].trim()==='') break
            if (validHostname(data.byline[i])) nameservers.push(data.byline[i].toLowerCase())
        }        
        return nameservers
    }

    isReserved(): boolean {
        // to implement
        return false
    }
    
    parseRegistrar(): string | null {
        const data = this.data
        let nsi = this.findIndexStarting("Registrar:")
        if (nsi<0) return null
        for(let i=nsi;i<this.totalLines();i++) {
            if (data.byline[i].trim()==='') break
            if (data.byline[i].startsWith("Name:")) 
                return data.byline[i].split('Name:')[1].trim()
        }
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