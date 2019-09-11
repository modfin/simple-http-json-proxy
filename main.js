const http = require('http');
const https = require('https');
const url = require('url');
let server = http.createServer((req, res) => {
    proxyUrl = req.url.replace('/', '');
    parsedUrl = url.parse(proxyUrl);
    console.info(`proxying ${proxyUrl}`)
    const handler = (proxyRes) => {
        proxyRes.pipe(res, {end: true});
        res.setHeader('content-type', 'application/json');
    }
    if (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') {
        let proxy = parsedUrl.protocol === 'https:'
            ? https.request(proxyUrl, { method: 'GET' }, handler)
            : http.request(proxyUrl, { method: 'GET' }, handler);
        req.pipe(proxy, {end: true});
    } else {
        res.writeHead(400, {'Content-Type': 'text/plain; charset=UTF-8'});
        res.write(`proxy url must be a valid url. expected: 'http[s]://host.tld/path/to/resource', actual: '${proxyUrl}'`);
        res.end();
    }
});
const port = 7357;
server.listen(port, undefined, undefined, () => console.info(`proxy server started. listening to port ${port}`));
