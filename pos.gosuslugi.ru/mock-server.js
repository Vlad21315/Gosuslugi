const http = require('http');
const fs = require('fs');
const path = require('path');

const mockServer = http.createServer((req, res) => {
    // Обработка мок-запросов
    if (req.url === '/mock/set-time-zone' && req.method === 'POST') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
    }

    // Обработка favicon
    if (req.url === '/favicon.ico' || req.url === '/assets/2ee1073bfe7fac1bb0652cb767eab7f0/favicon/new/favicon.ico') {
        const faviconPath = path.join(__dirname, 'favicon.ico');
        if (fs.existsSync(faviconPath)) {
            res.writeHead(200, { 'Content-Type': 'image/x-icon' });
            fs.createReadStream(faviconPath).pipe(res);
            return;
        }
    }

    // Обработка статических файлов
    const filePath = path.join(__dirname, req.url);
    if (fs.existsSync(filePath)) {
        const contentType = getContentType(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
        return;
    }

    res.writeHead(404);
    res.end('Not Found');
});

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.html': return 'text/html';
        case '.js': return 'application/javascript';
        case '.css': return 'text/css';
        case '.json': return 'application/json';
        case '.png': return 'image/png';
        case '.jpg': return 'image/jpeg';
        case '.jpeg': return 'image/jpeg';
        case '.svg': return 'image/svg+xml';
        default: return 'application/octet-stream';
    }
}

const PORT = 8000;
mockServer.listen(PORT, () => {
    console.log(`Mock server running on http://localhost:${PORT}`);
});
