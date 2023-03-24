#!/usr/bin/env node
import chalk from 'chalk'
import { parseWhois, rawWhois } from './tools'
import mini from "minimist"
const argv = mini(process.argv.splice(2))

async function start() {
    try {
        let domain = argv._[0] ? argv._[0] : "test.com"
        // console.log(`whois2json ${domain}`)
        let got = await rawWhois(domain)
        if (got) {
            // console.log(got)
            let res = parseWhois(got)
            console.log(res)
        } else {
            console.log()
        }
    } catch (err) {
        console.log(err)
    }
}

start()