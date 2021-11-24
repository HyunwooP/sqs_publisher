import _ from "lodash";
import env from "../../env";
import CommonEnum from "../enum";
import WebSocket from "../protocol/ws";
import { postAPI } from "../protocol/http";
import { QueueMessagesIE } from "../common/interface";
import {
  DeleteMessageBatchResult,
  MessageItems,
  ReceiveMessageResult,
} from "../sqs/type";
import MessageQueue from "../sqs/MessageQueue";
import intervalController from "./interval";
import {
  createDeleteEntry,
  failedDeleteMessage,
  getMultipleMessageQueueMessages,
  getSingleMessageQueueMessages,
  successDeleteMessage
} from "./preprocessor";
import constant from "../../lib/common/constant";

const messageController = (queueUrls: string[]): void => {
  if (!_.isEmpty(queueUrls)) {
    intervalController.intervalPullingMessage(queueUrls);
  }
};

export const deleteMessage = async ({
  queueUrl,
  id,
  receiptHandle,
}: {
  queueUrl: string;
  id: string;
  receiptHandle: string;
}): Promise<void> => {
  const deleteResponse: DeleteMessageBatchResult =
    await MessageQueue.deleteMessageBatch({
      QueueUrl: queueUrl,
      Entries: [
        {
          Id: id,
          ReceiptHandle: receiptHandle,
        },
      ],
    });

  if (!_.isEmpty(deleteResponse.Failed)) {
    failedDeleteMessage({
      failed: deleteResponse.Failed,
      queueUrl,
      id,
      receiptHandle
    });
  }

  if (!_.isEmpty(deleteResponse.Successful)) {
    successDeleteMessage(deleteResponse.Successful);
  }
};

export const getMessageItems = async (queueUrl: string): Promise<MessageItems> => {
  const messageItems: ReceiveMessageResult = await MessageQueue.getMessage({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: constant.RECEIVE_MAX_NUMBER_OF_MESSAGES,
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

  // Message Queue들을 순회...
  for (const queueUrl of queueUrls) {
    const queueMessages = multipleQueueMessages[queueUrl];

    // Message Queue안에 Message들을 순회...
    for (const queueMessage of queueMessages) {
      const { receiptHandle, body, id } = createDeleteEntry(queueMessage);

      if (!_.isEmpty(receiptHandle)) {
        await deleteMessage({ queueUrl, id, receiptHandle });
        messageBody.push(body);
      } else {
        throw new Error(CommonEnum.ErrorStatus.IS_NOT_VALID_REQUIRE_MESSAGE_PARAMS);
      }
    }
  }

  return messageBody;
};

export const sendSubScribeToMessage = async (message: string): Promise<void> => {
  console.log(`go subscribe ==============> ${message}`);

  if (env.IS_SEND_TO_SOCKET_SUBSCRIBE) {
    WebSocket.sendMessage(message);
  } else {
    await postAPI(env.SUB_SCRIBE_A_SERVER_ORIGIN, {
      message
    });
  }
};

export default messageController;
