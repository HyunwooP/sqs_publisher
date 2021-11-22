import { ListQueuesResult, Message, MessageList } from "aws-sdk/clients/sqs";
import { PromiseResult, Request } from "aws-sdk/lib/request";

export type ReceiveMessageRequest = AWS.SQS.Types.ReceiveMessageRequest;

export type ReceiveMessageResult = AWS.SQS.Types.ReceiveMessageResult;

export type SendMessageRequest = AWS.SQS.Types.SendMessageRequest;

export type SendMessageResult = AWS.SQS.Types.SendMessageResult;

export type CreateQueueRequest = AWS.SQS.Types.CreateQueueRequest;

export type CreateQueueResult = AWS.SQS.Types.CreateQueueResult;

export type DeleteQueueRequest = AWS.SQS.Types.DeleteQueueRequest;

export type DeleteMessageRequest = AWS.SQS.Types.DeleteMessageRequest;

export type DeleteMessageBatchRequest = AWS.SQS.Types.DeleteMessageBatchRequest;

export type DeleteMessageBatchResult = AWS.SQS.Types.DeleteMessageBatchResult;

export type DeleteMessageBatchResultEntryList =
  AWS.SQS.Types.DeleteMessageBatchResultEntryList;

export type BatchResultErrorEntryList = AWS.SQS.Types.BatchResultErrorEntryList;

export type DeleteMessageBatchResultEntry =
  AWS.SQS.Types.DeleteMessageBatchResultEntry;

export type BatchResultErrorEntry = AWS.SQS.Types.BatchResultErrorEntry;

export type AWSError = AWS.AWSError;

export type QueueResponse = ListQueuesResult;

export type MessageItems = MessageList;

export type MessageItem = Message;

export type GetQueueResponse = PromiseResult<ListQueuesResult, AWSError>;

export type VoidResponse = Request<{}, AWSError>;
