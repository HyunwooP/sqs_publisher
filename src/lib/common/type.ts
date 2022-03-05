import { MessageItem, MessageItems } from "../sqs/type";

export type QueueMessages = {
  [queueUrl: string]: MessageItems;
};

export type QueueController = {
  queueUrls: string[];
};

export type DeleteEntry = {
  receiptHandle: string;
  body: string;
  id: string;
};

export type ErrorResponse = {
  errorMessage: string;
};

export type MessageEntity = {
  endPoint: string;
  params: string | undefined;
};

export type UnknownObject<T = unknown> = Record<string, T>;

export interface IQueueMessage extends MessageItem {}
