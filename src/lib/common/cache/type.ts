import { CacheKeys } from "@/lib/enum/cache";

export type CacheItem = {
  deleteMessageFailedIdCountGroup: {
    [key: string]: number;
  };
  intervalPullingMessageId: null | NodeJS.Timer;
};

export type ReturnDefaultValue = string | number | null | object | [];

export type CacheValue = number | NodeJS.Timer | null;

export type CacheObjectName = CacheKeys.DELETE_MESSAGE_FAILED_COUNT_GROUP;
