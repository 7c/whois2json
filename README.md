# whois2json
library to whois certain TLDs. We use whoisserver-world library to parseDomain and tests. More importantly we take whoisServers from this library. Make sure it is up2date.

## API
`npm i --save https://github.com/7c/whois2json`

```
import { whois2json } from '7c/whois2json'
```

## CLI
`npm i -g https://github.com/7c/whois2json`


### dist/tldinfo <tld>
shows information about top-level-domain such as `sampleDomains`

### dist/whois2json <hostname>
whois given hostname`s domain and outputs as json