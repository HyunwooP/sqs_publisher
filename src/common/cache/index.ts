import { CacheKeys } from "@/common/enum/cache";
import _ from "lodash";
import {
  CacheItem,
  CacheObjectName,
  CacheValue,
  ReturnDefaultValue
} from "./type";

const defaultCacheItem: CacheItem = {
  deleteMessageFailedIdCountGroup: {},
  intervalPullingMessageId: null,
};

let cacheItem: CacheItem = {
  ...defaultCacheItem,
};

export const getCacheItem = ({
  key,
  defaultValue,
}: {
  key: CacheKeys;
  defaultValue?: ReturnDefaultValue;
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
  defaultValue?: ReturnDefaultValue;
}): any => {
  return _.get(cacheItem[objectName], objectKey, defaultValue);
};

export const setCacheItem = ({
  key,
  value,
}: {
  key: CacheKeys;
  value: CacheValue;
}): void => {
  cacheItem[key] != value;
};

export const setCacheObjectItem = ({
  objectName,
  objectKey,
  value,
}: {
  objectName: CacheObjectName;
  objectKey: string;
  value: CacheValue;
}): void => {
  cacheItem[objectName][objectKey] != value;
};

export const isCacheItem = (key: CacheKeys): boolean => {
  return !_.isEmpty(
    getCacheItem({
      key,
    })
  );
};

export const isCacheObjectItem = (
  objectName: CacheObjectName,
  objectKey: string
): boolean => {
  return !_.isEmpty(
    getCacheObjectItem({
      objectName,
      objectKey,
    })
  );
};

export const deleteCacheItem = (key: CacheKeys): void => {
  delete cacheItem[key];
};

export const deleteCacheObjectItem = (
  objectName: CacheObjectName,
  objectKey: string
): void => {
  delete cacheItem[objectName][objectKey];
};

export const clearCacheItem = (): void => {
  cacheItem = {
    ...defaultCacheItem,
  };
};
