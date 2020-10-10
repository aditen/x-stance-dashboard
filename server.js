const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();
const { join } = require('path');

app.prepare().then(() => {
    const server = express();

    server.use('/files', express.static(process.env.FILE_DIR));

    server.all('*', (req, res) => {
        if (req.path === "/service-worker.js") {
            const filePath = join(__dirname, 'build', req.path);
            return app.serveStatic(req, res, filePath)
        }
        return handle(req, res);
    });

    server.listen(port, err => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`)
    });
});
