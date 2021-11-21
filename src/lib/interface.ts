import { MessageItems } from "../lib/sqs/type";

export interface CacheIE {
  queueUrls: string[];
  intervalPullingMessageId: null | NodeJS.Timer;
};

export interface QueueMessageIE {
  [index: string]: MessageItems;
};