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

export type AWSError = AWS.AWSError;

export type QueueResponse = ListQueuesResult;

export type MessageItems = MessageList;

export type MessageItem = Message;

export type CreateQueueResponse = PromiseResult<CreateQueueResult, AWSError>;

export type GetQueueResponse = PromiseResult<ListQueuesResult, AWSError>;

export type ReceiveMessageResponse = PromiseResult<
  ReceiveMessageResult,
  AWSError
>;

export type SendMessageResponse = PromiseResult<SendMessageResult, AWSError>;

export type VoidResponse = Request<{}, AWSError>;
