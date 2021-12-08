import _ from "lodash";
import CommonConstant from "../../lib/common/constant";
import { createRouteForPublisher } from "../../lib/protocol/express";
import publishController from "../../lib/publisher";
import { MessageEntityIE, QueueMessagesIE } from "../common/interface";
import CommonEnum from "../enum";
import env from "../env";
import { postAPI } from "../protocol/ajax";
import WebSocket from "../protocol/ws";
import MessageQueue from "../sqs/MessageQueue";
import {
  DeleteMessageBatchResult,
  MessageItems,
  ReceiveMessageResult
} from "../sqs/type";
import intervalController from "./interval";
import {
  createDeleteEntry, createSubScribeMessageItem, failedDeleteMessage,
  getMultipleMessageQueueMessages,
  getSingleMessageQueueMessages, successDeleteMessage
} from "./preprocessor";

const messageController = (queueUrls: string[]): void => {
  if (!_.isEmpty(queueUrls)) {
    if (env.IS_PULLING_MESSAGE) {
      console.log("PULLING MESSAGE");
      intervalController.intervalPullingMessage(queueUrls);
    } else {
      console.log("EVENT DRIVEN TO RESTFUL");
      createRouteForPublisher({
        queueUrls,
        action: sender
      })
    }
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
  const { endPoint, params }: MessageEntityIE = createSubScribeMessageItem(message);
  
  console.log(`endPoint =========> ${endPoint} / params =========> ${params}`);
  
  if (env.IS_SEND_TO_SOCKET_SUBSCRIBE) {
    const message = _.isEmpty(params) ? endPoint : `${endPoint}/${params}`;
    WebSocket.sendMessage(message);
  } else {
    const response = await postAPI(endPoint, { params });
    console.log(`StateLess Response =========> ${response}`);
  }
};

export const sender = async (queueUrls: string[]): Promise<void> => {
  const messageQueuesInMessage: string[] = await getMessageToDeleteWorker(
    queueUrls,
  );

  if (_.isEmpty(messageQueuesInMessage)) {
    const convertMSecondToSecond = Math.floor(
      CommonConstant.DELAY_START_INTERVAL_TIME / 1000,
    );
    console.log(
      `Message Queue has Non Message So, Set Delay ${convertMSecondToSecond} second`,
    );

    // delayStartIntervalPullingMessage();
    // 개발환경에서 계속 메세지가 필요할 경우 위 함수를 막고 아래를 푼다.
    publishController(queueUrls);
  } else {
    /**
     * @description
     * SQS에 등록된 모든 Message Queue들의 메세지를 꺼내서 전송하기 때문에,
     * 각각에 맞는 Subscribe Server가 존재한다면, 메세지 설계를 잘해야한다.
     */
    _.forEach(messageQueuesInMessage, (message: string) => {
      sendSubScribeToMessage(message);
    });
  }
};

export default messageController;
