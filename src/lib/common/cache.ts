import _ from "lodash";

export enum CacheKeyStatus {
  INTERVAL_PULLING_MESSAGE_ID = "intervalPullingMessageId",
}

export interface CacheIE {
  intervalPullingMessageId: null | NodeJS.Timer;
}

const defaultCacheItem: CacheIE = {
  intervalPullingMessageId: null,
};

let cacheItem: CacheIE = {
  ...defaultCacheItem
};

export const getCacheItem = (
  key: CacheKeyStatus | number,
  defaultValue?: string | number | null | [],
): any => _.get(cacheItem, key, defaultValue);

export const setCacheItem = (key: CacheKeyStatus, value: any): void => {
  cacheItem[key] = value;
};

export const clearCacheItem = (): void => {
  cacheItem = {
    ...defaultCacheItem
  };
}
