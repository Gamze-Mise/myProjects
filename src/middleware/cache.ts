import { Request, Response, NextFunction } from "express";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

export const cacheMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.method !== "GET") {
    next();
    return;
  }

  const key = req.originalUrl;
  const cachedResponse = cache.get<unknown>(key);

  if (cachedResponse) {
    res.json(cachedResponse);
    return;
  }

  const originalJson = res.json;
  res.json = function (body) {
    cache.set(key, body);
    return originalJson.call(this, body);
  };

  next();
};
