import _ from "lodash";
import { CacheKeyStatus } from "./enum";
import { CacheIE } from "./interface";

const caches: CacheIE = {
  queueUrls: [],
  intervalPullingMessageId: null,
};

export const getCacheItem = (
  key: CacheKeyStatus | number,
  defaultValue?: string | number | null | []
): any => _.get(caches, key, defaultValue);

export const setCacheItem = (
  key: CacheKeyStatus,
  value: any
): void => {
  caches[key] = value;
}

export default caches;