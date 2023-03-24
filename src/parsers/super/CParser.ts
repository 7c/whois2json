import { tRawWhois,domainStatus } from './../../types'

export class CParser  {
    data:tRawWhois
    constructor(data:tRawWhois) {
        this.data = data
    }
    
    findIndexStarting(startingWith:string):number {
        for(let i=0;i<this.data.byline.length;i++)
            if (this.data.byline[i].startsWith(startingWith)) return i
        return -1
    }

    totalLines(): number {
        return this.data.byline.length as number
    }
    

    parseStatusCom():domainStatus[] {
        const data = this.data
        let status: domainStatus[] = []
        for (let l of data.byline) {
            if (l.startsWith(`Domain Status: clientTransferProhibited`))
                status.push(domainStatus.clientTransferProhibited)
            if (l.startsWith(`Domain Status: redemptionPeriod`))
                status.push(domainStatus.redemptionPeriod)
            if (l.startsWith(`Domain Status: clientDeleteProhibited`))
                status.push(domainStatus.clientDeleteProhibited)
            if (l.startsWith(`Domain Status: serverTransferProhibited`))
                status.push(domainStatus.serverTransferProhibited)
            if (l.startsWith(`Domain Status: serverDeleteProhibited`))
                status.push(domainStatus.serverDeleteProhibited)
            if (l.startsWith(`Domain Status: clientUpdateProhibited`))
                status.push(domainStatus.clientUpdateProhibited)
            if (l.startsWith(`Domain Status: ok`))
                status.push(domainStatus.ok)
        }
        return status
    }
}