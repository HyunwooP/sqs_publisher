import _ from "lodash";
import MessageQueue from "../sqs/MessageQueue";
import { CacheKeyStatus, ErrorStatus } from "../enum";
import { MessageResponseStatus } from "../enum/message";
import { QueueMessageIE } from "../../lib/interface";
import { ReceiveMessageResponse, MessageItems } from "../../lib/sqs/type";
import worker from "../../lib/worker";
import { getCacheItem, setCacheItem } from "../../lib/cache";
import constant from '../../lib/const';

// todo: return interface 만들기.
const messageController = async (queueUrls: string[]): Promise<void> => {
  let queueMessages: QueueMessageIE = {};

  if (!_.isEmpty(queueUrls)) {
    // todo: stateless & statefull 둘 다 로직 짜서 환경변수에 따라 적용하게 하여,
    // todo: subscribe 만들기
    // todo: 메세지를 쏘면, message queue에 지워버리기. MessageQueue.deleteMessage
    queueMessages = await getMessages(queueUrls);
  }

  console.log('========================')
  console.log(queueMessages);
  console.log(`time ====> ${new Date().getTime()}`);
  console.log('========================')
};

const getMessages = async (queueUrls: string[]) => {
  let queueMessages: QueueMessageIE = {};
    
  if (queueUrls.length < 2) {
    const queueUrl: string = _.get(queueUrls, 0, "");
    queueMessages = { ...await getSingleMessageQueueInMessages(queueUrl) };
  } else {
    queueMessages = { ...await getMultipleMessageQueueInMessages(queueUrls) };
  }

  return queueMessages;
};

// 여러개의 Message Queue 처리
const getMultipleMessageQueueInMessages = async (queueUrls: string[]): Promise<QueueMessageIE> => {
  const queueMessages: QueueMessageIE = {};

  for (const queueUrl of queueUrls) {
    // 한개의 Message Queue당 담고 있는 Message를 담는다.
    const messages = await getMessageItems(queueUrl);
    queueMessages[queueUrl] = messages;
  }

  return queueMessages;
};

// 단일 Message Queue 처리
const getSingleMessageQueueInMessages = async (queueUrl: string): Promise<QueueMessageIE> => {
  const queueMessage: QueueMessageIE = {};

  const messages = await getMessageItems(queueUrl);
  queueMessage[queueUrl] = messages;

  return queueMessage;
};

export const getMessageItems = async (queueUrl: string): Promise<MessageItems> => {
  const messageItems: ReceiveMessageResponse = await MessageQueue.getMessage({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10
  });

  return _.get(messageItems, MessageResponseStatus.MESSAGES, []);
};

export const intervalPullingMessage = (queueUrls: string[]) => {
  try {
    const intervalPullingMessageId: NodeJS.Timer = setInterval(() => {
      messageController(queueUrls);
    }, constant.MESSAGE_PULLING_TIME);

    setCacheItem(CacheKeyStatus.INTERVAL_PULLING_MESSAGE_ID, intervalPullingMessageId);
  } catch(error) {
    console.error(`============ intervalPullingMessage Error ============ ${error}`);
    // todo: restart인지, clear인지 에러 로직에 대해서 고민해보기...
    throw new Error(ErrorStatus.STOP_INTERVAL_PULLING_MESSAGE);
  }
};

export const clearIntervalPullingMessage = (): void => {
  const intervalPullingMessageId = getCacheItem(CacheKeyStatus.INTERVAL_PULLING_MESSAGE_ID, null);
  if (!_.isNull(intervalPullingMessageId)) {
    clearInterval(intervalPullingMessageId);
    setCacheItem(CacheKeyStatus.INTERVAL_PULLING_MESSAGE_ID, null);
  }
};

export const reStartIntervalPullingMessage = (): void => {
  clearIntervalPullingMessage();
  worker();
};

export default messageController;