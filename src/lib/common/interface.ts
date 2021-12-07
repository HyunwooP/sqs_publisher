import { MessageItem, MessageItems } from "../sqs/type";

export interface QueueMessagesIE {
  [index: string]: MessageItems;
}

export interface QueueMessageIE extends MessageItem {}

export interface QueueControllerIE {
  queueUrls: string[];
}

export interface DeleteEntry {
  receiptHandle: string;
  body: string;
  id: string;
}

export interface ErrorResponseIE {
  errorMessage: string;
}

export interface MessageEntityIE {
  endPoint: string;
  params: string | undefined;
}