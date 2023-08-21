import { IrawParser } from "../interfaces";
import { CParser } from "./super/CParser";
import dbg from "debug"
import { domainStatus } from "../types";
import { validHostname } from "mybase"
const debug = dbg("parser:gg")

export class parser_gg extends CParser implements IrawParser {
    isFree() {
        const data = this.data
        if (data.byline[0]==='NOT FOUND') return true
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
        for(let i=nsi+1;i<this.totalLines();i++) {
            if (data.byline[i].trim()==='') break
            return data.byline[i].trim()
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
        let nsi = this.findIndexStarting("Domain Status:")
        if (nsi<0) return []
        if (this.data.byline[nsi+1].trim()==='Active') return [domainStatus.ok]
        return []
    }

    parseCreationDate(): Date | boolean {
        const data = this.data
        let nsi = this.findIndexStarting("Relevant dates:")
        if (nsi<0) return false
        for(let i=nsi+1;i<this.totalLines();i++) {
            if (data.byline[i].startsWith('Registered on')) {
                // todo
            }
        }
        return false
    }

   
}