import _ from "lodash";
import { deleteMessage, getMessageItems } from ".";
import { CacheKeyStatus, getCacheItem, setCacheItem } from "../common/cache";
import constant from "../common/constant";
import {
  DeleteEntry,
  QueueMessageIE,
  QueueMessagesIE,
} from "../common/interface";
import CommonEnum from "../enum";
import {
  BatchResultErrorEntry,
  BatchResultErrorEntryList,
  DeleteMessageBatchResultEntry,
  DeleteMessageBatchResultEntryList,
} from "../sqs/type";

// 여러개의 Message Queue 처리
export const getMultipleMessageQueueMessages = async (
  queueUrls: string[],
): Promise<QueueMessagesIE> => {
  const queueMessages: QueueMessagesIE = {};

  for (const queueUrl of queueUrls) {
    // 한개의 Message Queue당 담고 있는 Message를 담는다.
    const messages = await getMessageItems(queueUrl);
    queueMessages[queueUrl] = messages;
  }

  return queueMessages;
};

// 단일 Message Queue 처리
export const getSingleMessageQueueMessages = async (
  queueUrl: string,
): Promise<QueueMessagesIE> => {
  const queueMessage: QueueMessagesIE = {};

  const messages = await getMessageItems(queueUrl);
  queueMessage[queueUrl] = messages;

  return queueMessage;
};

export const createDeleteEntry = (
  queueMessage: QueueMessageIE,
): DeleteEntry => {
  const receiptHandle: string = _.get(
    queueMessage,
    CommonEnum.MessageItemStatus.RECEIPT_HANDLE,
    "",
  );
  const body: string = _.get(
    queueMessage,
    CommonEnum.MessageItemStatus.BODY,
    "",
  );
  const id: string = _.get(
    queueMessage,
    CommonEnum.MessageItemStatus.MESSAGE_ID,
    "",
  );

  return {
    receiptHandle,
    body,
    id,
  };
};

export const successDeleteMessage = (
  successful: DeleteMessageBatchResultEntryList,
): void => {
  _.forEach(successful, (deleteEntry: DeleteMessageBatchResultEntry) => {
    console.log(`Delete Successful Response ===========>`, deleteEntry);
  });
};

const messageFailedCountController = (messageId: string) => {
  let deleteMessageFailedCount = getCacheItem({
    objectName: CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP,
    objectKey: messageId,
  });

  // todo: cache module에 isNonCacheItem 만들기
  if (_.isUndefined(deleteMessageFailedCount)) {
    setCacheItem({
      objectName: CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP,
      objectKey: messageId,
      value: 0,
    });
  } else {
    setCacheItem({
      objectName: CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP,
      objectKey: messageId,
      value: ++deleteMessageFailedCount,
    });
  }
};

export const failedDeleteMessage = ({
  failed,
  queueUrl,
  id,
  receiptHandle,
}: {
  failed: BatchResultErrorEntryList;
  queueUrl: string;
  id: string;
  receiptHandle: string;
}): void => {
  _.forEach(failed, (deleteEntry: BatchResultErrorEntry) => {
    const deleteMessageFailedCount = getCacheItem({
      objectName: CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP,
      objectKey: id,
    });

    console.log(
      `${queueUrl} Delete Failed Response ===========> message id: ${id} / count = ${deleteMessageFailedCount}`,
    );
    if (deleteMessageFailedCount < constant.MAXIMUM_DELETE_COUNT) {
      messageFailedCountController(id);
      setTimeout(() => {
        deleteMessage({
          queueUrl,
          id,
          receiptHandle,
        });
      }, constant.DELAY_DELETE_MESSAGE_TIME);
    } else {
      throw new Error(CommonEnum.ErrorStatus.MAXIMUM_DELETE_COUNT_OVER);
    }
  });
};
