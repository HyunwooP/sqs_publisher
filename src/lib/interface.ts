import { MessageItems } from "../lib/sqs/type";

export interface CacheIE {
  queueUrls: string[];
  intervalPullingMessageId: NodeJS.Timer;
};

export interface QueueMessageIE {
  [index: string]: MessageItems
};