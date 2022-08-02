import MessageQueue from "@/sqs/MessageQueue";
import _ from "lodash";
import { getCacheItem } from "../common/cache";
import CommonConstant from "../common/constant";
import { CacheKeys } from "../common/enum/cache";
import { MessageItemObject, MessageResponse } from "../common/enum/message";
import { DeleteEntry, MessageEntity, QueueMessagesItems } from "../common/type";
import config from "../config";
import { Message, MessageList, ReceiveMessageResult } from "../sqs/type";

export const getMessageItems = async (
  queueUrl: string
): Promise<MessageList> => {
  const messages: ReceiveMessageResult = await MessageQueue.getMessage({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: CommonConstant.RECEIVE_MAX_NUMBER_OF_MESSAGES,
  });

  return _.get(messages, MessageResponse.MESSAGES, []);
};

export const getMultipleMessageQueueMessages = async (
  queueUrls: string[]
): Promise<QueueMessagesItems> => {
  const queueMessages = {} as QueueMessagesItems;

  for (const queueUrl of queueUrls) {
    const messages = await getMessageItems(queueUrl);
    queueMessages[queueUrl] = messages;
  }

  return queueMessages;
};

export const getSingleMessageQueueMessages = async (
  queueUrl: string
): Promise<QueueMessagesItems> => {
  const queueMessages = {} as QueueMessagesItems;
  queueMessages[queueUrl] = await getMessageItems(queueUrl);
  return queueMessages;
};

export const createDeleteEntry = (queueMessage: Message): DeleteEntry => {
  const receiptHandle: string = _.get(
    queueMessage,
    MessageItemObject.RECEIPT_HANDLE,
    ""
  );
  const body: string = _.get(queueMessage, MessageItemObject.BODY, "");
  const id: string = _.get(queueMessage, MessageItemObject.MESSAGE_ID, "");

  return {
    receiptHandle,
    body,
    id,
  };
};

export const getMaximumDeleteCountOverMessages = (): string[] => {
  const deleteMessageFailedIdCountGroup = getCacheItem({
    key: CacheKeys.DELETE_MESSAGE_FAILED_COUNT_GROUP,
    defaultValue: {},
  });

  const messageIds = Object.keys(deleteMessageFailedIdCountGroup).filter(
    (messageId: string) => {
      return (
        deleteMessageFailedIdCountGroup[messageId] >=
        CommonConstant.MAXIMUM_DELETE_COUNT
      );
    }
  );

  return messageIds;
};

export const createSubScribeMessageItem = (message: string): MessageEntity => {
  const messages: MessageEntity = JSON.parse(message);

  if (config.IS_SEND_TO_SOCKET_SUBSCRIBE) {
    const endPointSplit = messages["endPoint"].split(config.PARAMS_SPLIT_TYPE);
    messages["endPoint"] = endPointSplit[endPointSplit.length - 1];
  }

  return messages;
};
