const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health') {
    res.writeHead(200);
    return res.end(JSON.stringify({ status: 'healthy' }));
  }

  if (req.url === '/api/items') {
    res.writeHead(200);
    return res.end(JSON.stringify({
      items: [
        { id: 1, name: 'Item One' },
        { id: 2, name: 'Item Two' },
        { id: 3, name: 'Item Three' }
      ]
    }));
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Mock API running at http://127.0.0.1:3000');
});
