import _ from "lodash";
import { deleteMessage, getMessageItems } from ".";
import {
  deleteCacheObjectItem,
  getCacheItem,
  getCacheObjectItem,
  isCacheObjectItem,
  setCacheObjectItem
} from "../common/cache";
import CommonConstant from "../common/constant";
import { DeleteEntry, MessageEntity, QueueMessagesItems } from "../common/type";
import config from "../config";
import { CacheKeys } from "../enum/cache";
import { ErrorStatus } from "../enum/error";
import { MessageItemObject } from "../enum/message";
import {
  BatchResultErrorEntry,
  BatchResultErrorEntryList,
  DeleteMessageBatchResultEntry,
  DeleteMessageBatchResultEntryList,
  MessageItem
} from "../sqs/type";

export const getMultipleMessageQueueMessages = async (
  queueUrls: string[],
): Promise<QueueMessagesItems> => {
  const queueMessages = {} as QueueMessagesItems;

  for (const queueUrl of queueUrls) {
    const messages = await getMessageItems(queueUrl);
    queueMessages[queueUrl] = messages;
  }

  return queueMessages;
};

export const getSingleMessageQueueMessages = async (
  queueUrl: string,
): Promise<QueueMessagesItems> => {
  const queueMessages = {} as QueueMessagesItems;
  queueMessages[queueUrl] = await getMessageItems(queueUrl);
  return queueMessages;
};

export const createDeleteEntry = (queueMessage: MessageItem): DeleteEntry => {
  const receiptHandle: string = _.get(
    queueMessage,
    MessageItemObject.RECEIPT_HANDLE,
    "",
  );
  const body: string = _.get(queueMessage, MessageItemObject.BODY, "");
  const id: string = _.get(queueMessage, MessageItemObject.MESSAGE_ID, "");

  return {
    receiptHandle,
    body,
    id,
  };
};

export const successDeleteMessage = ({
  successful,
  queueUrl,
  messageId,
}: {
  successful: DeleteMessageBatchResultEntryList;
  queueUrl: string;
  messageId: string;
}): void => {
  _.forEach(successful, (deleteEntry: DeleteMessageBatchResultEntry) => {
    console.log(`
      ${queueUrl} Delete Successful Response ===========>
      message id = ${messageId} /
      id = ${deleteEntry.Id}
      `,
    );

    if (
      isCacheObjectItem(CacheKeys.DELETE_MESSAGE_FAILED_COUNT_GROUP, messageId)
    ) {
      deleteCacheObjectItem(
        CacheKeys.DELETE_MESSAGE_FAILED_COUNT_GROUP,
        messageId,
      );
    }
  });
};

const messageFailedCountController = (messageId: string): number => {
  const defaultFailStartCount = 1;
  let deleteMessageFailedCount: number = getCacheObjectItem({
    objectName: CacheKeys.DELETE_MESSAGE_FAILED_COUNT_GROUP,
    objectKey: messageId,
    defaultValue: defaultFailStartCount,
  });

  if (deleteMessageFailedCount > defaultFailStartCount) {
    ++deleteMessageFailedCount;
  }

  setCacheObjectItem({
    objectName: CacheKeys.DELETE_MESSAGE_FAILED_COUNT_GROUP,
    objectKey: messageId,
    value: deleteMessageFailedCount,
  });

  return deleteMessageFailedCount;
};

export const failedDeleteMessage = ({
  failed,
  queueUrl,
  messageId,
  receiptHandle,
}: {
  failed: BatchResultErrorEntryList;
  queueUrl: string;
  messageId: string;
  receiptHandle: string;
}): void => {
  _.forEach(failed, (deleteEntry: BatchResultErrorEntry) => {
    const deleteMessageFailedCount = messageFailedCountController(messageId);
    console.log(`
      ${queueUrl} Delete Failed Response ===========>
      message id = ${messageId} /
      count = ${deleteMessageFailedCount} /
      id = ${deleteEntry.Id} /
      code = ${deleteEntry.Code} /
      message = ${deleteEntry.Message} /
      senderFault = ${deleteEntry.SenderFault}
      `,
    );

    if (deleteMessageFailedCount < CommonConstant.MAXIMUM_DELETE_COUNT) {
      setTimeout(() => {
        deleteMessage({
          queueUrl,
          messageId,
          receiptHandle,
        });
      }, CommonConstant.DELAY_DELETE_MESSAGE_TIME);
    } else {
      throw new Error(ErrorStatus.MAXIMUM_DELETE_COUNT_OVER);
    }
  });
};

const getMaximumDeleteCountOverMessages = (): string[] => {
  const deleteMessageFailedIdCountGroup = getCacheItem({
    key: CacheKeys.DELETE_MESSAGE_FAILED_COUNT_GROUP,
    defaultValue: {},
  });

  const messageIds = Object.keys(deleteMessageFailedIdCountGroup).filter((messageId: string) => {
    return deleteMessageFailedIdCountGroup[messageId] >= CommonConstant.MAXIMUM_DELETE_COUNT;
  });

  return messageIds;
};

export const showMaximumDeleteCountOverMessages = (): void => {
  const messageIds = getMaximumDeleteCountOverMessages();

  if (!_.isEmpty(messageIds)) {
    console.log(
      `${CommonConstant.MAXIMUM_DELETE_COUNT}회 삭제 실패한 메세지가 있습니다.`,
    );

    _.forEach(messageIds, (messageId: string) => {
      console.log(`message id = ${messageId}`);
    });
  }
};

export const createSubScribeMessageItem = (message: string): MessageEntity => {
  const messages: MessageEntity = JSON.parse(message);

  if (config.IS_SEND_TO_SOCKET_SUBSCRIBE) {
    const endPointSplit = messages["endPoint"].split(
      config.PARAMS_SPLIT_TYPE,
    );
    messages["endPoint"] = endPointSplit[endPointSplit.length - 1];
  }

  return messages;
};
