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
import { getMessageItems } from ".";

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

export const successDeleteMessage = (successful: DeleteMessageBatchResultEntryList): void => {
  _.forEach(
    successful,
    (deleteEntry: DeleteMessageBatchResultEntry) => {
      console.log(`Delete Successful Response ===========>`, deleteEntry);
    },
  );
};

export const failedDeleteMessage = (failed: BatchResultErrorEntryList): void => {
  // todo: 실패 했을 시, 다시 삭제를 재요청하는 로직을...
  _.forEach(failed, (deleteEntry: BatchResultErrorEntry) => {
    console.log(`Delete Failed Response ===========>`, deleteEntry);
  });
};