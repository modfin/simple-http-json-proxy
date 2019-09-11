# simple http json proxy

Simple http server that proxies requests via url.

start:
```
node main.js
```

use:

Make a http GET request to `http://localhost:7357/http[s]://host.tld/path/to/resource` to get the json response of `http[s]://host.tld/path/to/resource` back.

examples:
```
curl http://localhost:7357/http://fx.modfin.se/latest
```

or visit `http://localhost:7357/http://fx.modfin.se/latest` in a web browser.
