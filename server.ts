import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import express from 'express';
import compression from 'compression';
import { Request, Response } from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  // Enable compression
  server.use(
    compression({
      level: 6,
      threshold: 1024,
      filter: (req: Request, res: Response) => {
        if (req.headers['x-no-compression']) {
          return false;
        }
        return compression.filter(req, res);
      },
    })
  );

  server.engine(
    'html',
    ngExpressEngine({
      bootstrap,
    })
  );

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Serve static files from /browser with optimized caching
  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y',
      etag: true,
      lastModified: true,
      setHeaders: (res, path) => {
        // Set appropriate cache headers for different file types
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        } else if (path.endsWith('.css') || path.endsWith('.js')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (path.match(/\.(jpg|jpeg|png|gif|ico|svg|woff|woff2)$/)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }

        // Enable HTTP/2 push hints
        if (path.endsWith('.html')) {
          res.setHeader(
            'Link',
            '</styles.css>; rel=preload; as=style, </main.js>; rel=preload; as=script'
          );
        }
      },
    })
  );

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
