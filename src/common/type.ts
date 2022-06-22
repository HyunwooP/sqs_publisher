import { MessageList, QueueAttributeName } from "../sqs/type";

export type QueueAttributes = {
  [key: QueueAttributeName]: string;
};

export type QueueMessagesItems = {
  [queueUrl: string]: MessageList;
};

export type QueueMessages = {
  [queueUrl: string]: string[];
};

export type QueueController = {
  queueUrls: string[];
  deadLetterQueueUrl: string;
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

export type CreateDeadLetterQueueResult = {
  deadLetterQueueUrl: string;
  deadLetterQueueArn: string;
}

export type UnknownObject<T = unknown> = Record<string, T>;
