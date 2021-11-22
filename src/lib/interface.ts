import { MessageItem, MessageItems } from "../lib/sqs/type";

export interface CacheIE {
  intervalPullingMessageId: null | NodeJS.Timer;
}

export interface QueueMessagesIE {
  [index: string]: MessageItems;
}

export interface QueueMessageIE extends MessageItem {}

export interface QueueControllerIE {
  queueUrls: string[];
}

export interface MessageControllerIE {}

export interface SubScribeRequestIE {
  [index: string]: string[];
}
