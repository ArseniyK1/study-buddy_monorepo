import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';

export function CacheResponse(ttl: number = 600) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    console.log(
      'CacheResponse decorator applied to:',
      target.constructor.name,
      propertyKey,
    );

    descriptor.value = async function (...args: any[]) {
      const cacheManager = this.cacheManager;
      if (!cacheManager) {
        throw new Error(
          'Cache manager not found. Make sure to inject CACHE_MANAGER in your service.',
        );
      }

      const cacheKey = `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;
      const cachedData = await cacheManager.get(cacheKey);

      if (cachedData) {
        console.log('Cache hit:', cacheKey);
        return cachedData;
      }

      const result = await originalMethod.apply(this, args);
      await cacheManager.set(cacheKey, result, ttl);
      return result;
    };

    return descriptor;
  };
}
