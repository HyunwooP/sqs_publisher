import _ from "lodash";
import { deleteMessage, getMessageItems } from ".";
import {
    CacheKeyStatus,
    deleteCacheObjectItem,
    getCacheItem,
    getCacheObjectItem,
    isCacheObjectItem,
    setCacheObjectItem
} from "../common/cache";
import CommonConstant from "../common/constant";
import {
    DeleteEntry, IQueueMessage, MessageEntity, QueueMessages
} from "../common/type";
import CommonEnum from "../enum";
import env from "../env";
import {
    BatchResultErrorEntry,
    BatchResultErrorEntryList,
    DeleteMessageBatchResultEntry,
    DeleteMessageBatchResultEntryList
} from "../sqs/type";

export const getMultipleMessageQueueMessages = async (
  queueUrls: string[],
): Promise<QueueMessages> => {
  const queueMessages = {} as QueueMessages;

  for (const queueUrl of queueUrls) {
    const messages = await getMessageItems(queueUrl);
    queueMessages[queueUrl] = messages;
  }

  return queueMessages;
};

export const getSingleMessageQueueMessages = async (
  queueUrl: string,
): Promise<QueueMessages> => {
  const queueMessage = {} as QueueMessages;

  const messages = await getMessageItems(queueUrl);
  queueMessage[queueUrl] = messages;

  return queueMessage;
};

export const createDeleteEntry = (
  queueMessage: IQueueMessage,
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

export const successDeleteMessage = ({
  successful,
  messageId,
}: {
  successful: DeleteMessageBatchResultEntryList;
  messageId: string;
}): void => {
  _.forEach(successful, (deleteEntry: DeleteMessageBatchResultEntry) => {
    console.log(`Delete Successful Response ===========>`, deleteEntry);

    if (
      isCacheObjectItem(
        CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP,
        messageId,
      )
    ) {
      deleteCacheObjectItem(
        CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP,
        messageId,
      );
    }
  });
};

const messageFailedCountController = (messageId: string): number => {
  let deleteMessageFailedCount: number = getCacheObjectItem({
    objectName: CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP,
    objectKey: messageId,
  });

  if (_.isUndefined(deleteMessageFailedCount)) {
    setCacheObjectItem({
      objectName: CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP,
      objectKey: messageId,
      value: 0,
    });
  } else {
    setCacheObjectItem({
      objectName: CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP,
      objectKey: messageId,
      value: ++deleteMessageFailedCount,
    });
  }

  return deleteMessageFailedCount ?? 0;
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
    const deleteMessageFailedCount: number =
      messageFailedCountController(messageId);
    console.log(
      `${queueUrl} Delete Failed Response ===========> message id: ${messageId} / count = ${deleteMessageFailedCount}`,
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
      throw new Error(CommonEnum.ErrorStatus.MAXIMUM_DELETE_COUNT_OVER);
    }
  });
};

const getMaximumDeleteCountOverMessages = (): string[] => {
  const messageObject = getCacheItem({
    key: CacheKeyStatus.DELETE_MESSAGE_FAILED_COUNT_GROUP,
  });

  const messageIds = Object.keys(messageObject).filter((messageId: string) => {
    return messageObject[messageId] >= CommonConstant.MAXIMUM_DELETE_COUNT;
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
  const messageItems: MessageEntity = JSON.parse(message);

  if (env.IS_SEND_TO_SOCKET_SUBSCRIBE) {
    const endPointSplit = messageItems["endPoint"].split(env.PARAMS_SPLIT_TYPE);
    messageItems["endPoint"] = endPointSplit[endPointSplit.length - 1];
  }
  return messageItems;
};
