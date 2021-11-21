import _ from "lodash";
import { QueueResponse } from "../../lib/sqs/type";
import { QueueResponseStatus } from "../../lib/enum/queue";
import MessageQueue from "../sqs/MessageQueue";

// todo: return interface 만들기.
const queueController = async () => {
  // process...
  const queueUrls = await getQueueUrls();
  
  return {
    queueUrls,
  };
};

const getQueueUrls = async () => {
  const queueResponse: QueueResponse = await getQueueResponse();
  const queueUrls: string[] = createQueueUrls(queueResponse);

  return queueUrls;
};

const getQueueResponse = async (): Promise<QueueResponse> => {
  return await MessageQueue.getQueues();
};

const createQueueUrls = (queues: QueueResponse): string[] => {
  return _.get(queues, QueueResponseStatus.QUEUE_URLS, []);
};

export default queueController;