import _ from "lodash";
import CommonConstant from "../../lib/common/constant";
import { QueueMessagesIE } from "../common/interface";
import CommonEnum from "../enum";
import env from "../env";
import { postAPI } from "../protocol/ajax";
import WebSocket from "../protocol/ws";
import MessageQueue from "../sqs/MessageQueue";
import {
  DeleteMessageBatchResult,
  MessageItems,
  ReceiveMessageResult,
} from "../sqs/type";
import intervalController from "./interval";
import {
  createDeleteEntry,
  failedDeleteMessage,
  getMultipleMessageQueueMessages,
  getSingleMessageQueueMessages,
  successDeleteMessage,
} from "./preprocessor";

const messageController = (queueUrls: string[]): void => {
  if (!_.isEmpty(queueUrls)) {
    intervalController.intervalPullingMessage(queueUrls);
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
      messageId,
    });
  }
};

export const getMessageItems = async (
  queueUrl: string,
): Promise<MessageItems> => {
  const messageItems: ReceiveMessageResult = await MessageQueue.getMessage({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: CommonConstant.RECEIVE_MAX_NUMBER_OF_MESSAGES,
  });

  return _.get(messageItems, CommonEnum.MessageResponseStatus.MESSAGES, []);
};

const getMessageQueueInMessages = async (
  queueUrls: string[],
): Promise<QueueMessagesIE> => {
  let queueMessages: QueueMessagesIE = {};

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
): Promise<any> => {
  const multipleQueueMessages: QueueMessagesIE =
    await getMessageQueueInMessages(queueUrls);
  let messageBody: string[] = [];

  // * Message Queue들을 순회...
  for (const queueUrl of queueUrls) {
    const queueMessages = multipleQueueMessages[queueUrl];

    // * Message Queue안에 Message들을 순회...
    for (const queueMessage of queueMessages) {
      const { receiptHandle, body, id } = createDeleteEntry(queueMessage);

      if (!_.isEmpty(receiptHandle) && !_.isEmpty(body) && !_.isEmpty(id)) {
        await deleteMessage({ queueUrl, messageId: id, receiptHandle });
        messageBody.push(body);
      } else {
        throw new Error(
          CommonEnum.ErrorStatus.IS_NOT_VALID_REQUIRE_MESSAGE_PARAMS,
        );
      }
    }
  }

  return messageBody;
};

export const sendSubScribeToMessage = async (
  message: string,
): Promise<void> => {
  console.log(`go subscribe ==============> ${message}`);

  if (env.IS_SEND_TO_SOCKET_SUBSCRIBE) {
    WebSocket.sendMessage(message);
  } else {
    // todo: message에서 endpoint, params 축출하기
    await postAPI(message);
  }
};

export default messageController;
