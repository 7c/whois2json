import chalk from 'chalk'
import mini from "minimist"
import { tlds,parseDomain } from "whoisserver-world"
const argv = mini(process.argv.splice(2))
const TLDS = tlds()

async function start() {
    try {
        let tld = argv._[0] ? argv._[0] : "com"
        if (TLDS.hasOwnProperty(tld.toLowerCase())) {
            let parsed = parseDomain(`testwerwerw.${tld}`)
            console.log(parsed.tldData)
        }
        else {
            console.log(chalk.red(`TLD ${chalk.inverse(tld)} does not exist`))
        }
        process.exit(1)
    } catch (err) {
        console.log(err,chalk.red(err))
    }
}

start()