import { MessageItem, MessageItems } from "../sqs/type";

export interface QueueMessagesIE {
  [index: string]: MessageItems;
}

export interface QueueMessageIE extends MessageItem {}

export interface QueueControllerIE {
  queueUrls: string[];
}

export interface MessageControllerIE {}

export interface DeleteEntry {
  receiptHandle: string;
  body: string;
  id: string;
}

export interface ErrorResponseIE {
  errorMessage: string;
}