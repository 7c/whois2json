import chalk from 'chalk'
import { tldDetails } from 'whoisserver-world'
import { parseWhois, rawWhois } from '../tools'
import { wait } from 'mybase'

async function start() {
    try {
        for (let tld of ['com', 'net', 'org']) {
            let tldData = tldDetails(tld)
            for (let t of Object.keys(tldData.sampleDomains))
                for (let domain of tldData.sampleDomains[t]) {
                    console.log(chalk.inverse(domain))
                    let data = await rawWhois(domain)
                    let got = parseWhois(data)
                    console.log(got)
                    await wait(1)
                }
        }

    } catch (err) {
        console.log(chalk.red(err))
    }
}

start()