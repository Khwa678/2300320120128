const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 4300;
const root = path.join(__dirname);

function sendFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Server error');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    return sendFile(res, path.join(root, 'index.html'), 'text/html');
  }

  const parsedPath = path.join(root, req.url);
  const ext = path.extname(parsedPath).toLowerCase();
  const contentType = ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : 'text/plain';

  fs.stat(parsedPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    sendFile(res, parsedPath, contentType);
  });
});

server.listen(port, () => {
  console.log(`Frontend server started at http://localhost:${port}`);
});
