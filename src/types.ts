
export type whoisJsonRegistered = {
    outcome: string,
    domain: string,
    tld: string,
    nameservers: string[],
    dates: {
        expiration: Date,
        created: Date,
        updated: Date
    },
    registrar: {
        name: string | null
    }
}

export type whoisJsonReserved = {
    outcome: string,
    domain: string,
    tld: string
}

export type whoisJsonFree = {
    outcome: string,
    domain: string,
    tld: string
}

export type whoisJsonInvalid = {
    outcome: string,
    domain: string,
    tld: string
}

export enum domainStatus {
    redemptionPeriod = 'redemptionPeriod',
    clientTransferProhibited = 'clientTransferProhibited',
    clientDeleteProhibited = 'clientDeleteProhibited',
    clientUpdateProhibited = 'clientUpdateProhibited',
    serverDeleteProhibited = 'serverDeleteProhibited',
    serverTransferProhibited = 'serverTransferProhibited',
    ok = 'ok',
}

export type tRawWhois = {
    tld: string,
    hostname: string,
    parsedHostname: any,
    raw: string,
    byline: string[]
}