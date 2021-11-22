import { MessageItems } from "../lib/sqs/type";

export interface CacheIE {
  intervalPullingMessageId: null | NodeJS.Timer;
};

export interface QueueMessageIE {
  [index: string]: MessageItems;
};

export interface QueueControllerIE {
  queueUrls: string[];
};

export interface MessageControllerIE {};
