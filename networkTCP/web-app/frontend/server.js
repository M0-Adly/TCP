const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3005;

http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        }
    });
}).listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});


