import { Request } from "aws-sdk/lib/request";

export type ReceiveMessageRequest = AWS.SQS.Types.ReceiveMessageRequest;

export type ReceiveMessageResult = AWS.SQS.Types.ReceiveMessageResult;

export type SendMessageRequest = AWS.SQS.Types.SendMessageRequest;

export type SendMessageResult = AWS.SQS.Types.SendMessageResult;

export type QueueAttributeMap = AWS.SQS.QueueAttributeMap;

export type QueueAttributeName = AWS.SQS.QueueAttributeName;

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

export type ListQueuesRequest = AWS.SQS.Types.ListQueuesRequest;

export type ListQueuesResult = AWS.SQS.Types.ListQueuesResult;

export type MessageList = AWS.SQS.Types.MessageList;

export type Message = AWS.SQS.Types.Message;

export type VoidResponse = Request<{}, AWSError>;

export type GetQueueAttributesRequest = AWS.SQS.Types.GetQueueAttributesRequest;

export type GetQueueAttributesResult = AWS.SQS.Types.GetQueueAttributesResult;

export type GetQueueUrlRequest = AWS.SQS.Types.GetQueueUrlRequest;

export type GetQueueUrlResult = AWS.SQS.Types.GetQueueUrlResult;

export type ListDeadLetterSourceQueuesRequest =
  AWS.SQS.Types.ListDeadLetterSourceQueuesRequest;

export type ListDeadLetterSourceQueuesResult =
  AWS.SQS.Types.ListDeadLetterSourceQueuesResult;
