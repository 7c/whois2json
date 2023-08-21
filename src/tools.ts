import chalk from "chalk"
import mini from "minimist"

import { parser_com } from './parsers/com'
import whois from 'whois'
import dbg from 'debug'
import { parseDomain } from 'whoisserver-world'
import { parser_de } from './parsers/de'
import { parser_eu } from './parsers/eu'
import { parser_gg } from './parsers/gg'
import { parser_ai } from './parsers/ai'
import { parser_at } from './parsers/at'
import { tRawWhois, whoisJsonRegistered, whoisJsonFree, whoisJsonReserved } from './types'
const debug = dbg("tools")
const argv = mini(process.argv.slice(2))

export function rawWhois(hostname: string): Promise<tRawWhois | boolean> {
    debug(`rawWhois(${hostname})`)
    return new Promise(async function (resolve, reject) {
        let parsedHostname = parseDomain(hostname) // get the domainpart
        if (!parsedHostname) {
            debug(`invalid domain`)
            return resolve(false)
        }
        let domain = parsedHostname.domain
        let tld = parsedHostname.tld

        let whoisOptions = {
            follow: 0,
            server: "",
        }

        // we update whoisserver from whoisserver-world for certain tlds
        if (['ooo', 'tv'].includes(tld)) {
            let whoisServer = parsedHostname.tldData.whoisServer
            if (Array.isArray(whoisServer) && whoisServer.length > 0)
                whoisOptions['server'] = whoisServer[0]
        }


        // console.log(whoisOptions)
        // let parsed = psl.parse(domain)
        // console.log(domain)
        whois.lookup(domain, whoisOptions, (err: any, raw: any) => {
            if (err) return resolve(false)

            let byline = raw.split(/\n/)
            let byline_sanitized: string[] = []
            for (let line of byline) {
                line = line.trim()
                line = line.replace(/\r$/, '')
                byline_sanitized.push(line)
            }

            let resultat = {
                hostname,
                parsedHostname: parsedHostname,
                raw,
                byline: byline_sanitized

            }
            return resolve(resultat as tRawWhois)
        })
    })
}

export function parseWhois(data: tRawWhois | boolean): whoisJsonRegistered | whoisJsonFree | whoisJsonReserved | boolean {
    debug("parseWhois")
    if (typeof data === 'object') {
        const tld = data.parsedHostname.tld
        debug(`tld:${tld}`)
        let parser
        if (argv.scan) {
            for (let p of [
                  new parser_com(data)
                , new parser_de(data)
                , new parser_ai(data)
                , new parser_gg(data)
                , new parser_eu(data)
                , new parser_at(data)]) {
                if (p.isRegistered() || p.isFree() || p.isReserved()) {
                    console.log(chalk.blue.inverse(`scanned ${tld} and found ${p.constructor.name}`))
                    parser = p
                    break
                }
            }
        }
        // com,net,org,info,biz very similar raw data

        if (tld === 'com' ||
            tld === 'net' ||
            tld === 'org' ||
            tld === 'biz' ||
            tld === 'life' ||
            tld === 'fun' ||
            tld === 'pics' ||
            tld === 'top' ||
            tld === 'world' ||
            tld === 'site' ||
            tld === 'io' ||
            tld === 'us' ||
            tld === 'ooo' ||
            tld === 'tv' ||
            tld === 'cc' ||
            tld === 'xyz' ||
            tld === 'pro' ||
            tld === 'live' ||
            tld === 'me' ||
            tld === 'motorcycles' ||
            tld === 'info') parser = new parser_com(data)

        if (tld === 'de') parser = new parser_de(data)
        if (tld === 'ai') parser = new parser_ai(data)
        if (tld === 'eu') parser = new parser_eu(data)
        if (tld === 'gg') parser = new parser_gg(data)
        if (tld === 'at') parser = new parser_at(data)


        if (!parser) return false


        // domain is free
        if (parser.isFree()) {
            let ret = {
                outcome: "free",
                domain: data.hostname.toLowerCase(),
                tld: data.parsedHostname.tldData.tld,
            }
            return ret as whoisJsonFree
        }
        // domain is reserved, TODO
        if (parser.isReserved()) {
            let ret = {
                outcome: "reserved",
                domain: data.hostname.toLowerCase(),
                tld: data.parsedHostname.tldData.tld,
            }
            return ret as whoisJsonReserved
        }

        // domain is registered
        if (parser.isRegistered()) {
            let ret = {
                outcome: "registered",
                domain: data.hostname.toLowerCase(),
                tld: data.parsedHostname.tldData.tld,
                nameservers: parser.parseNameservers(),
                dates: {
                    expiration: parser.parseExpiration(),
                    created: parser.parseCreationDate(),
                    updated: parser.parseUpdateDate()
                },
                status: parser.parseStatus(),
                registrar: {
                    name: parser.parseRegistrar()
                }
            }
            return ret as whoisJsonRegistered
        }


    }
    // error
    return false

}