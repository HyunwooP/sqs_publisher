import _ from "lodash";
import MessageQueue from "../sqs/MessageQueue";
import { MessageItemStatus, MessageResponseStatus } from "../enum/message";
import { QueueMessagesIE, SubScribeRequestIE } from "../../lib/interface";
import { ReceiveMessageResponse, MessageItems } from "../../lib/sqs/type";
import { ErrorStatus } from "../../lib/enum";
import intervalController from "./interval";

const messageController = async (queueUrls: string[]): Promise<void> => {
  if (!_.isEmpty(queueUrls)) {
    // todo: stateless & statefull 둘 다 로직 짜서 환경변수에 따라 적용하게 하여,
    // todo: subscribe 만들기
    intervalController.intervalPullingMessage(queueUrls);
  }
};

// 여러개의 Message Queue 처리
const getMultipleMessageQueueMessages = async (queueUrls: string[]): Promise<QueueMessagesIE> => {
  const queueMessages: QueueMessagesIE = {};

  for (const queueUrl of queueUrls) {
    // 한개의 Message Queue당 담고 있는 Message를 담는다.
    const messages = await getMessageItems(queueUrl);
    queueMessages[queueUrl] = messages;
  }

  return queueMessages;
};

// 단일 Message Queue 처리
const getSingleMessageQueueMessages = async (queueUrl: string): Promise<QueueMessagesIE> => {
  const queueMessage: QueueMessagesIE = {};

  const messages = await getMessageItems(queueUrl);
  queueMessage[queueUrl] = messages;

  return queueMessage;
};

const getMessageItems = async (queueUrl: string): Promise<MessageItems> => {
  const messageItems: ReceiveMessageResponse = await MessageQueue.getMessage({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10
  });

  return _.get(messageItems, MessageResponseStatus.MESSAGES, []);
};

const deleteMessage = async (queueUrl: string, receiptHandle: string): Promise<void> => {
  await MessageQueue.deleteMessage({
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle
  });
};

const getMessageQueueInMessages = async (queueUrls: string[]): Promise<QueueMessagesIE> => {
  let queueMessages: QueueMessagesIE = {};
  
  if (queueUrls.length < 2) {
    const queueUrl: string = _.get(queueUrls, 0, "");
    queueMessages = { ...await getSingleMessageQueueMessages(queueUrl) };
  } else {
    queueMessages = { ...await getMultipleMessageQueueMessages(queueUrls) };
  }

  return queueMessages;
};

export const getMessageToDeleteWorker = async (queueUrls: string[]): Promise<any> => {
  const multipleQueueMessages: QueueMessagesIE = await getMessageQueueInMessages(queueUrls);
  const messageItem: SubScribeRequestIE = {};

  for (const queueUrl of queueUrls) {
    const singleQueueMessages = multipleQueueMessages[queueUrl];
    messageItem[queueUrl] = [];

    for (const singleQueueMessage of singleQueueMessages) {
      const receiptHandle: string = _.get(singleQueueMessage, MessageItemStatus.RECEIPT_HANDLE, "");
      const body: string = _.get(singleQueueMessage, MessageItemStatus.BODY, "");

      if (receiptHandle !== "") {
        deleteMessage(queueUrl, receiptHandle);
        messageItem[queueUrl].push(body);
      } else {
        // SQS 필수 파라메터 누락
        throw new Error(ErrorStatus.IS_NOT_VALID_REQUIRE_MESSAGE_PARAMS);
      }
    }
  }

  return messageItem;
};

export default messageController;