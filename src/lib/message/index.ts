import _ from "lodash";
import CommonEnum from "../enum";
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

const messageController = async (queueUrls: string[]): Promise<void> => {
  if (!_.isEmpty(queueUrls)) {
    // todo: stateless & statefull 둘 다 로직 짜서 환경변수에 따라 적용하게 하여,
    // todo: subscribe 만들기
    intervalController.intervalPullingMessage(queueUrls);
  }
};

const deleteMessage = async ({
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
    failedDeleteMessage(deleteResponse.Failed);
  }

  if (!_.isEmpty(deleteResponse.Successful)) {
    successDeleteMessage(deleteResponse.Successful);
  }
};

export const getMessageItems = async (queueUrl: string): Promise<MessageItems> => {
  const messageItems: ReceiveMessageResult = await MessageQueue.getMessage({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10,
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
  const messageItem: string[] = [];

  // Message Queue들을 순회...
  for (const queueUrl of queueUrls) {
    const queueMessages = multipleQueueMessages[queueUrl];

    // Message Queue안에 Message들을 순회...
    for (const queueMessage of queueMessages) {
      const { receiptHandle, body, id } = createDeleteEntry(queueMessage);

      if (!_.isEmpty(receiptHandle)) {
        await deleteMessage({ queueUrl, id, receiptHandle });
        messageItem.push(body);
      } else {
        throw new Error(CommonEnum.ErrorStatus.IS_NOT_VALID_REQUIRE_MESSAGE_PARAMS);
      }
    }
  }

  return messageItem;
};

export default messageController;
