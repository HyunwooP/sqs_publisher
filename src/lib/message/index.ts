import _ from "lodash";
import MessageQueue from "../sqs/MessageQueue";
import { ErrorStatus } from "../enum";
import { MessageResponseStatus } from "../enum/message";
import { getCacheQueueUrls } from "../../lib/queue";
import { QueueMessageIE } from "../../lib/interface";
import { ReceiveMessageResponse, MessageItems } from "../../lib/sqs/type";
import cache from "../../lib/cache";
import constant from '../../lib/const';

const messageController = async (): Promise<void> => {
  
  const queueUrls: string[] = getCacheQueueUrls();

  if (!_.isEmpty(queueUrls)) {
    
    let queueMessages: QueueMessageIE = {};
    
    if (queueUrls.length < 2) {
      const queueUrl: string = _.get(queueUrls, 0, "");
      queueMessages = { ...await singleQueueController(queueUrl) };
    } else {
      queueMessages = { ...await multipleQueueController(queueUrls) };
    }

    // todo: stateless & statefull 둘 다 로직 짜서 환경변수에 따라 적용하게 하여,
    // todo: subscribe 만들기
    // todo: 메세지를 쏘면, message queue에 지워버리기. MessageQueue.deleteMessage
    console.log('========================')
    console.log(queueMessages);
    console.log(`time ====> ${new Date().getTime()}`);
    console.log('========================')
  }
};

// 여러개의 Message Queue 처리
const multipleQueueController = async (queueUrls: string[]): Promise<QueueMessageIE> => {
  const queueMessages: QueueMessageIE = {};

  for (const queueUrl of queueUrls) {
    // 한개의 Message Queue당 담고 있는 Message를 담는다.
    const messages = await getMessageItems(queueUrl);
    queueMessages[queueUrl] = messages;
  }

  return queueMessages;
};

// 단일 Message Queue 처리
const singleQueueController = async (queueUrl: string): Promise<QueueMessageIE> => {
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

export const intervalPullingMessage = (): void => {
  try {
    messageController();
    cache.intervalPullingMessageId = setInterval(() => {
      messageController();
    }, constant.MESSAGE_PULLING_TIME);
  } catch(error) {
    console.error(`============ intervalPullingMessage Error ============ ${error}`);
    throw new Error(ErrorStatus.STOP_INTERVAL_PULLING_MESSAGE);
  }
};

export default messageController;