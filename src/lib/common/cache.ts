import _ from "lodash";

export enum CacheKeyStatus {
  INTERVAL_PULLING_MESSAGE_ID = "intervalPullingMessageId",
  DELETE_MESSAGE_FAILED_COUNT_GROUP = "deleteMessageFailedCountGroup"
}

type CacheKeyType = CacheKeyStatus.INTERVAL_PULLING_MESSAGE_ID;
type CacheObjectNameType = CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP;
export interface CacheIE {
  deleteMessageFailedCountGroup: {
    [index: string]: number;
  },
  intervalPullingMessageId: null | NodeJS.Timer;
}

const defaultCacheItem: CacheIE = {
  deleteMessageFailedCountGroup: {},
  intervalPullingMessageId: null,
};

let cacheItem: CacheIE = {
  ...defaultCacheItem
};

export const getCacheItem = ({
  key,
  defaultValue,
} : {
  key: CacheKeyType;
  defaultValue?: string | number | null | [];
}): any => {
  return _.get(cacheItem, key, defaultValue);
};

export const  getCacheObjectItem = ({
  objectName,
  objectKey,
  defaultValue
} : {
  objectName: CacheObjectNameType;
  objectKey: string;
  defaultValue?: string | number | null | [];
}): any => {
  return _.get(cacheItem[objectName], objectKey, defaultValue);
};

export const setCacheItem = ({
  key,
  value
} : {
  key: CacheKeyType;
  value: any;
}): void => {
  cacheItem[key] = value;
};

export const  setCacheObjectItem = ({
  objectName,
  objectKey,
  value
} : {
  objectName: CacheObjectNameType;
  objectKey: string;
  value: any;
}): void => {
  cacheItem[objectName][objectKey] = value;
};

export const isCacheItem = (key: CacheKeyType): boolean => {
  return !_.isEmpty(
    getCacheItem({
      key
    })
  );
};

export const isCacheObjectItem = (
  objectName: CacheObjectNameType,
  objectKey: string
): boolean => {
  return !_.isEmpty(
    getCacheObjectItem({
      objectName,
      objectKey
    })
  );
}

export const deleteCacheItem = (key: CacheKeyType): void => {
  delete cacheItem[key];
};

export const deleteCacheObjectItem = (
  objectName: CacheObjectNameType,
  objectKey: string
): void => {
  delete cacheItem[objectName][objectKey];
};

export const clearCacheItem = (): void => {
  cacheItem = {
    ...defaultCacheItem
  };
};
