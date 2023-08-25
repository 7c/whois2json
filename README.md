# whois2json
library to whois certain TLDs. We use whoisserver-world library to parseDomain and tests. More importantly we take whoisServers from this library. Make sure it is up2date.

## API
`npm i --save https://github.com/7c/whois2json`

```
## to get parsed whois
import { whois2json,parseDomain } from '7c/whois2json'
let domain = parseDomain('www.example.com')
let result = await whois2json(domain.name)
```

```
## to get raw whois
import { rawWhois } from '7c/whois2json'
console.log(await rawWhois('example.com'))
```

## CLI
`npm i -g https://github.com/7c/whois2json`

--raw : will output raw whois
--scan : will scan all known parsers (development only)

### dist/tldinfo <tld>
shows information about top-level-domain such as `sampleDomains`

### dist/whois2json <hostname>
whois given hostname`s domain and outputs as json