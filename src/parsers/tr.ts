import { IrawParser } from "../interfaces";
import { CParser } from "./super/CParser";
import dbg from "debug"
import { domainStatus } from "../types";
import { validHostname } from "mybase"
const debug = dbg("parser:at")

export class parser_tr extends CParser implements IrawParser {
    isFree() {
        const data = this.data
        for (let l of data.byline) 
            if (l.startsWith(`No match found for`)) return true
        return false
    }

    isReserved(): boolean {
        // to implement
        return false
    }

    isRegistered(): boolean {
        const domain = this.data.parsedHostname.domain
        return this.data.raw.startsWith(`** Domain Name: ${domain}\n`)   
    }

    isInvalid(): boolean {
        return this.data.raw==='Invalid input'
    }

    parseNameservers(): string[] {
        const data = this.data
        let nameservers:string[]=[]
        let nsi = this.findIndexStarting("** Domain Servers:")
        if (nsi<0) return nameservers
        for(let i=nsi+1;i<this.totalLines();i++) {
            if (data.byline[i].trim()==='') break
            if (validHostname(data.byline[i])) nameservers.push(data.byline[i].toLowerCase())
        }        
        return nameservers
    }

    parseRegistrar(): string | null {
        const data = this.data
        let nsi = this.findIndexStarting("** Registrar:")
        if (nsi<0) return null
        for(let i=nsi+1;i<this.totalLines();i++) {
            if (data.byline[i].trim()==='') break
            if (data.byline[i].startsWith("Organization Name\t:")) 
                return data.byline[i].split(':')[1].trim()
        }        

       
        return null
    }

    parseUpdateDate(): Date | boolean {
        // not available within .tr domains
        return false
    }

    parseExpiration(): Date | boolean {
        for (let l of this.data.byline) 
            if (l.startsWith(`Expires on....`)) return new Date(l.split(':')[1].trim())
        return false
    }

    parseStatus(): domainStatus[] {
        return []
    }

    parseCreationDate(): Date | boolean {
        for (let l of this.data.byline) 
            if (l.startsWith(`Created on....`)) return new Date(l.split(':')[1].trim())
        return false
    }

   
}