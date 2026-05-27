import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

const apiCache = (duration) => (req, res, next) => {

  if (req.method !== 'GET') {
    return next();
  }

  const key = `__express__${req.originalUrl || req.url}`;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(cachedResponse);
  }

  const originalJson = res.json;
  res.json = function (body) {

    if (res.statusCode >= 200 && res.statusCode < 300) {

      const plainBody = JSON.parse(JSON.stringify(body));
      cache.set(key, plainBody, duration);
    }

    res.setHeader('X-Cache', 'MISS');
    originalJson.call(this, body);
  };

  next();
};

export default apiCache;
