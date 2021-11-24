import _ from "lodash";

export enum CacheKeyStatus {
  INTERVAL_PULLING_MESSAGE_ID = "intervalPullingMessageId",
  DELETE_MESSAGE_FAILED_COUNT_GROUP = "deleteMessageFailedCountGroup",
}

export interface CacheIE {
  deleteMessageFailedCountGroup: {
    [index: string]: number;
  };
  intervalPullingMessageId: null | NodeJS.Timer;
}

const defaultCacheItem: CacheIE = {
  deleteMessageFailedCountGroup: {},
  intervalPullingMessageId: null,
};

let cacheItem: CacheIE = {
  ...defaultCacheItem,
};

// todo: object prototype은 따로 함수 빼내기
export const getCacheItem = ({
  key,
  objectKey,
  objectName,
  defaultValue,
}: {
  key?: CacheKeyStatus | number;
  objectName?: CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP;
  objectKey?: string;
  defaultValue?: string | number | null | [];
}): any => {
  if (_.isEmpty(objectName) && _.isEmpty(objectKey)) {
    return _.get(cacheItem, key, defaultValue);
  } else {
    return _.get(cacheItem[objectName], objectKey, defaultValue);
  }
};

// todo: object prototype은 따로 함수 빼내기
export const setCacheItem = ({
  key,
  objectKey,
  objectName,
  value,
}: {
  key?: CacheKeyStatus;
  objectName?: CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP;
  objectKey?: string;
  value: any;
}): void => {
  if (_.isEmpty(objectName) && _.isEmpty(objectKey)) {
    cacheItem[key] = value;
  } else {
    cacheItem[objectName][objectKey] = value;
  }
};

export const clearCacheItem = (): void => {
  cacheItem = {
    ...defaultCacheItem,
  };
};
