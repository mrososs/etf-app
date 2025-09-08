import { Request, Response, NextFunction } from 'express';
import { gzip, deflate } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);
const deflateAsync = promisify(deflate);

export function compressionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const acceptEncoding = req.headers['accept-encoding'] || '';

  if (acceptEncoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Vary', 'Accept-Encoding');

    const originalSend = res.send;
    res.send = function (data: any) {
      if (typeof data === 'string' && data.length > 1024) {
        gzipAsync(Buffer.from(data, 'utf8'))
          .then((compressed) => {
            res.setHeader('Content-Length', compressed.length);
            originalSend.call(this, compressed);
          })
          .catch(() => {
            originalSend.call(this, data);
          });
      } else {
        originalSend.call(this, data);
      }
      return this;
    };
  } else if (acceptEncoding.includes('deflate')) {
    res.setHeader('Content-Encoding', 'deflate');
    res.setHeader('Vary', 'Accept-Encoding');

    const originalSend = res.send;
    res.send = function (data: any) {
      if (typeof data === 'string' && data.length > 1024) {
        deflateAsync(Buffer.from(data, 'utf8'))
          .then((compressed) => {
            res.setHeader('Content-Length', compressed.length);
            originalSend.call(this, compressed);
          })
          .catch(() => {
            originalSend.call(this, data);
          });
      } else {
        originalSend.call(this, data);
      }
      return this;
    };
  }

  next();
}
