import type { Context, Middleware, Next } from '../deps.ts';
import { responseError } from '../utils.ts';

class RequestStore {
  private readonly count: number;
  private readonly timestamp: number;

  constructor(count: number, timestamp: number) {
    this.count = count;
    this.timestamp = timestamp;
  }

  public getCount(): number {
    return this.count;
  }

  public getTimestamp(): number {
    return this.timestamp;
  }
}

interface RateLimitParams {
  limit: number;
  windowMs: number;
}

export default class RateLimit {
  private readonly map: Map<string, RequestStore>;

  constructor() {
    this.map = new Map();
  }

  public middleware(params: RateLimitParams, whitelist?: string[]): Middleware {
    const { limit, windowMs } = params;

    return async (context: Context, next: Next) => {
      const ip = context.request.ip;
      const path = context.request.url.pathname;
      const timestamp = Date.now();

      if (whitelist?.includes(path)) {
        return await next();
      }

      if (!this.map.has(ip)) {
        this.updateRate(context, limit, limit - 1, windowMs, ip, 1, timestamp);
        return await next();
      }

      const requestStore = this.map.get(ip) as RequestStore;
      const diff = timestamp - requestStore.getTimestamp();

      if (diff > windowMs) {
        this.updateRate(context, limit, limit - 1, windowMs, ip, 1, timestamp);
        return await next();
      }

      const count = requestStore.getCount() + 1;
      if (count > limit) {
        return responseError(context, new Error('Too many requests'), 429);
      }

      this.updateRate(context, limit, limit - count, windowMs, ip, count, timestamp);
      return await next();
    };
  }

  private updateRate(
    context: Context,
    limit: number,
    remaining: number,
    reset: number,
    ip: string,
    count: number,
    timestamp: number,
  ) {
    context.response.headers.set('X-RateLimit-Limit', limit.toString());
    context.response.headers.set('X-RateLimit-Remaining', remaining.toString());
    context.response.headers.set('X-RateLimit-Reset', reset.toString());

    this.map.set(ip, new RequestStore(count, timestamp));
  }
}
