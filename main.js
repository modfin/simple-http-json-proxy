const http = require('http');
const https = require('https');
const url = require('url');
let server = http.createServer((req, res) => {
    const queryObject = url.parse(req.url, true).query;
    const proxyUrl = queryObject.url;
    const parsedUrl = url.parse(proxyUrl || '');
    console.info(`proxying ${proxyUrl}`);

    res.setHeader('Access-Control-Allow-Origin', "*")
    res.setHeader('Access-Control-Allow-Methods', 'GET')

    const handler = (proxyRes) => {
        proxyRes.pipe(res, { end: true });
        res.setHeader('content-type', 'application/json');
    }
    if (
        (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:')
        && typeof parsedUrl.hostname === 'string'
        && typeof parsedUrl.path === 'string'
    ) {
        let proxy = parsedUrl.protocol === 'https:'
            ? https.request({ method: 'GET', ...parsedUrl }, handler)
            : http.request({ method: 'GET', ...parsedUrl }, handler);
        proxy.on('error', (e) => {
            res.writeHead(400, { 'Content-Type': 'text/plain; charset=UTF-8' });
            res.write(`proxy request '${proxyUrl}' error: ${e.message}`);
            res.end();
        })
        req.pipe(proxy, { end: true });
    } else {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.write(`proxy url must be a valid url. expected: 'http[s]://host.tld/path/to/resource', actual: '${proxyUrl}'`);
        res.end();
    }
});
const port = 7357;
server.listen(port, undefined, undefined, () => console.info(`proxy server started. listening to port ${port}`));
