import {
  deleteCacheObjectItem,
  getCacheObjectItem,
  isCacheObjectItem,
  setCacheObjectItem,
} from "@/common/cache";
import CommonConstant from "@/common/constant";
import { CacheKeys } from "@/enum/cache";
import _ from "lodash";
import {
  MessageEntity,
  QueueMessages,
  QueueMessagesItems,
} from "../common/type";
import config from "../config";
import { ErrorStatus } from "../enum/error";
import { postAPI } from "../protocol/axios";
import WebSocket from "../protocol/ws";
import MessageQueue from "../sqs/MessageQueue";
import {
  BatchResultErrorEntry,
  BatchResultErrorEntryList,
  DeleteMessageBatchResult,
  DeleteMessageBatchResultEntry,
  DeleteMessageBatchResultEntryList,
} from "../sqs/type";
import {
  createDeleteEntry,
  createSubScribeMessageItem,
  getMaximumDeleteCountOverMessages,
  getMultipleMessageQueueMessages,
  getSingleMessageQueueMessages,
} from "./preprocessor";
import { startMessageScheduler } from "./scheduler";

const messageController = async (queueUrls: string[]): Promise<void> => {
  // * 해당 인스턴스내에서 풀링하여 처리
  if (config.IS_PULLING_MESSAGE) {
    console.log("START PULLING MESSAGE");
    await startMessageScheduler(queueUrls);
  } else {
    /**
     * * 외부 HTTP 요청에 의해 처리
     * * worker - createExpressServer(queueUrls) 참조
     */
  }
};

export const deleteMessage = async ({
  queueUrl,
  messageId,
  receiptHandle,
}: {
  queueUrl: string;
  messageId: string;
  receiptHandle: string;
}): Promise<void> => {
  const deleteResponse: DeleteMessageBatchResult =
    await MessageQueue.deleteMessageBatch({
      QueueUrl: queueUrl,
      Entries: [
        {
          Id: messageId,
          ReceiptHandle: receiptHandle,
        },
      ],
    });

  if (!_.isEmpty(deleteResponse.Failed)) {
    failedDeleteMessage({
      failed: deleteResponse.Failed,
      queueUrl,
      messageId,
      receiptHandle,
    });
  }

  if (!_.isEmpty(deleteResponse.Successful)) {
    successDeleteMessage({
      successful: deleteResponse.Successful,
      queueUrl,
      messageId,
    });
  }
};

const getMessageQueueInMessages = async (
  queueUrls: string[],
): Promise<QueueMessagesItems> => {
  let queueMessages = {} as QueueMessagesItems;

  if (queueUrls.length < 2) {
    const queueUrl: string = _.get(queueUrls, 0, "");
    queueMessages = { ...(await getSingleMessageQueueMessages(queueUrl)) };
  } else {
    queueMessages = { ...(await getMultipleMessageQueueMessages(queueUrls)) };
  }

  return queueMessages;
};

export const getMessageToDeleteWorker = async (
  queueUrls: string[],
): Promise<QueueMessages> => {
  const multipleQueueMessages: QueueMessagesItems =
    await getMessageQueueInMessages(queueUrls);
  const messages: QueueMessages = {};

  // * Message Queue들을 순회...
  for (const queueUrl of queueUrls) {
    const queueMessages = multipleQueueMessages[queueUrl];

    // * Message Queue안에 Message들을 순회...
    for (const queueMessage of queueMessages) {
      const { receiptHandle, body, id } = createDeleteEntry(queueMessage);

      if (!_.isEmpty(receiptHandle) && !_.isEmpty(body) && !_.isEmpty(id)) {
        await deleteMessage({ queueUrl, messageId: id, receiptHandle });

        if (_.isEmpty(messages[queueUrl])) {
          messages[queueUrl] = [body];
        } else {
          messages[queueUrl].push(body);
        }
      } else {
        throw new Error(ErrorStatus.IS_NOT_VALID_REQUIRE_MESSAGE_PARAMS);
      }
    }
  }

  return messages;
};

export const sendMessage = async (
  queueUrl: string,
  message: string,
): Promise<void> => {
  await MessageQueue.sendMessage({
    QueueUrl: queueUrl,
    MessageBody: message,
  });
};

export const sendMessageToSubscriber = async (
  queueUrl: string,
  message: string,
): Promise<void> => {
  const { endPoint, params }: MessageEntity =
    createSubScribeMessageItem(message);

  console.log(`endPoint =========> ${endPoint} / params =========> ${params}`);
  try {
    if (config.IS_SEND_TO_SOCKET_SUBSCRIBE) {
      const message = _.isEmpty(params) ? endPoint : `${endPoint}/${params}`;
      await WebSocket.sendMessage(message);
    } else {
      const response = await postAPI(endPoint, { params });
      console.log(`StateLess Response =========> ${response}`);
    }
  } catch (error: unknown) {
    // * 전송에 대한 에러 대응으로, Message Queue에 이미 삭제된 해당 Message를 다시 삽입한다.
    console.log(
      `Message Queue Insert Failed Message message: ${message} / queueUrl: ${queueUrl}`,
    );
    sendMessage(queueUrl, message);
  }
};

const deleteMaximumDeleteCountOverMessage = (messageId: string): void => {
  deleteCacheObjectItem(CacheKeys.DELETE_MESSAGE_FAILED_COUNT_GROUP, messageId);
};

export const showMaximumDeleteCountOverMessages = (): void => {
  const messageIds = getMaximumDeleteCountOverMessages();

  if (!_.isEmpty(messageIds)) {
    console.log(
      `${CommonConstant.MAXIMUM_DELETE_COUNT}회 삭제 실패한 메세지가 있습니다.`,
    );

    _.forEach(messageIds, (messageId: string) => {
      console.log(`message id = ${messageId}`);

      if (config.IS_CHECK_FAILED_MESSAGE_CLEAR_CACHE) {
        console.log("해당 메세지는 캐시에서 제거 합니다.");
        deleteMaximumDeleteCountOverMessage(messageId);
      }
    });
  }
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
      `);

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
      `);

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

export default messageController;
