import _ from "lodash";

export enum CacheKeyStatus {
  INTERVAL_PULLING_MESSAGE_ID = "intervalPullingMessageId",
  DELETE_MESSAGE_FAILED_COUNT_GROUP = "deleteMessageFailedCountGroup",
}

export type Cache = {
  deleteMessageFailedCountGroup: {
    [index: string]: number;
  };
  intervalPullingMessageId: null | NodeJS.Timer;
}

type CacheKey =
  | CacheKeyStatus.INTERVAL_PULLING_MESSAGE_ID
  | CacheObjectName;
type CacheObjectName = CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP;

const defaultCacheItem: Cache = {
  deleteMessageFailedCountGroup: {},
  intervalPullingMessageId: null,
};

let cacheItem: Cache = {
  ...defaultCacheItem,
};

export const getCacheItem = ({
  key,
  defaultValue,
}: {
  key: CacheKey;
  defaultValue?: string | number | null | [];
}): any => {
  return _.get(cacheItem, key, defaultValue);
};

export const getCacheObjectItem = ({
  objectName,
  objectKey,
  defaultValue,
}: {
  objectName: CacheObjectName;
  objectKey: string;
  defaultValue?: string | number | null | [];
}): any => {
  return _.get(cacheItem[objectName], objectKey, defaultValue);
};

export const setCacheItem = ({
  key,
  value,
}: {
  key: CacheKey;
  value: any;
}): void => {
  cacheItem[key] = value;
};

export const setCacheObjectItem = ({
  objectName,
  objectKey,
  value,
}: {
  objectName: CacheObjectName;
  objectKey: string;
  value: any;
}): void => {
  cacheItem[objectName][objectKey] = value;
};

export const isCacheItem = (key: CacheKey): boolean => {
  return !_.isEmpty(
    getCacheItem({
      key,
    }),
  );
};

export const isCacheObjectItem = (
  objectName: CacheObjectName,
  objectKey: string,
): boolean => {
  return !_.isEmpty(
    getCacheObjectItem({
      objectName,
      objectKey,
    }),
  );
};

export const deleteCacheItem = (key: CacheKey): void => {
  delete cacheItem[key];
};

export const deleteCacheObjectItem = (
  objectName: CacheObjectName,
  objectKey: string,
): void => {
  delete cacheItem[objectName][objectKey];
};

export const clearCacheItem = (): void => {
  cacheItem = {
    ...defaultCacheItem,
  };
};
