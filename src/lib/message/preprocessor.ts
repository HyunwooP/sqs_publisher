import _ from "lodash";
import {
  DeleteEntry,
  QueueMessageIE,
  QueueMessagesIE
} from "../common/interface";
import {
  BatchResultErrorEntry,
  BatchResultErrorEntryList,
  DeleteMessageBatchResultEntry,
  DeleteMessageBatchResultEntryList
} from "../sqs/type";
import CommonEnum from "../enum";
import { CacheKeyStatus, deleteCacheObjectItem, getCacheObjectItem, isCacheObjectItem, setCacheObjectItem } from "../common/cache";
import CommonConstant from "../common/constant";
import { deleteMessage, getMessageItems } from ".";

export const getMultipleMessageQueueMessages = async (
  queueUrls: string[],
): Promise<QueueMessagesIE> => {
  const queueMessages: QueueMessagesIE = {};

  for (const queueUrl of queueUrls) {
    const messages = await getMessageItems(queueUrl);
    queueMessages[queueUrl] = messages;
  }

  return queueMessages;
};

export const getSingleMessageQueueMessages = async (
  queueUrl: string,
): Promise<QueueMessagesIE> => {
  const queueMessage: QueueMessagesIE = {};

  const messages = await getMessageItems(queueUrl);
  queueMessage[queueUrl] = messages;

  return queueMessage;
};

export const createDeleteEntry = (queueMessage: QueueMessageIE): DeleteEntry => {
  const receiptHandle: string = _.get(
    queueMessage,
    CommonEnum.MessageItemStatus.RECEIPT_HANDLE,
    "",
  );
  const body: string = _.get(queueMessage, CommonEnum.MessageItemStatus.BODY, "");
  const id: string = _.get(queueMessage, CommonEnum.MessageItemStatus.MESSAGE_ID, "");

  return {
    receiptHandle,
    body,
    id,
  };
};

export const successDeleteMessage = ({
  successful,
  messageId
} : {
  successful: DeleteMessageBatchResultEntryList,
  messageId: string
}): void => {
  _.forEach(
    successful,
    (deleteEntry: DeleteMessageBatchResultEntry) => {
      console.log(`Delete Successful Response ===========>`, deleteEntry);
      
      if (isCacheObjectItem(CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP, messageId)) {
        deleteCacheObjectItem(CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP, messageId);
      }
    },
  );
};

const messageFailedCountController = (messageId: string): number => {
  let deleteMessageFailedCount: number = getCacheObjectItem({
    objectName: CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP,
    objectKey: messageId
  });

  if (_.isUndefined(deleteMessageFailedCount)) {
    setCacheObjectItem({
      objectName: CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP,
      objectKey: messageId,
      value: 0
    });
  } else {
    setCacheObjectItem({
      objectName: CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP,
      objectKey: messageId,
      value: ++deleteMessageFailedCount
    });
  }

  return deleteMessageFailedCount ?? 0;
};

export const failedDeleteMessage = ({
  failed,
  queueUrl,
  messageId,
  receiptHandle
} : {
  failed: BatchResultErrorEntryList;
  queueUrl: string;
  messageId: string;
  receiptHandle: string;
}): void => {
  _.forEach(
    failed,
    (deleteEntry: BatchResultErrorEntry) => {
      const deleteMessageFailedCount: number = messageFailedCountController(messageId);
      console.log(`${queueUrl} Delete Failed Response ===========> message id: ${messageId} / count = ${deleteMessageFailedCount}`);

      if (deleteMessageFailedCount < CommonConstant.MAXIMUM_DELETE_COUNT) {
        setTimeout(() => {
          deleteMessage({
            queueUrl,
            id: messageId,
            receiptHandle
          })
        }, CommonConstant.DELAY_DELETE_MESSAGE_TIME);
      } else {
        throw new Error(CommonEnum.ErrorStatus.MAXIMUM_DELETE_COUNT_OVER);
      }
    },
  );
};