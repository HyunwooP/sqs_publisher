import _ from "lodash";
import CommonConstant from "../common/constant";
import {
  MessageEntity,
  QueueMessages,
  QueueMessagesItems,
} from "../common/type";
import config from "../config";
import { ErrorStatus } from "../enum/error";
import { MessageResponse } from "../enum/message";
import { postAPI } from "../protocol/axios";
import WebSocket from "../protocol/ws";
import MessageQueue from "../sqs/MessageQueue";
import {
  DeleteMessageBatchResult,
  MessageItems,
  ReceiveMessageResult,
} from "../sqs/type";
import {
  createDeleteEntry,
  createSubScribeMessageItem,
  failedDeleteMessage,
  getMultipleMessageQueueMessages,
  getSingleMessageQueueMessages,
  successDeleteMessage,
} from "./preprocessor";
import { startMessageScheduler } from "./scheduler";

const messageController = (queueUrls: string[]): void => {
  // * 해당 인스턴스내에서 풀링하여 처리
  if (config.IS_PULLING_MESSAGE) {
    console.log("START PULLING MESSAGE");
    startMessageScheduler(queueUrls);
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

export const getMessageItems = async (
  queueUrl: string,
): Promise<MessageItems> => {
  const messages: ReceiveMessageResult = await MessageQueue.getMessage({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: CommonConstant.RECEIVE_MAX_NUMBER_OF_MESSAGES,
  });

  return _.get(messages, MessageResponse.MESSAGES, []);
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

export default messageController;
