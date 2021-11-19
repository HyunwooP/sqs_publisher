import _ from "lodash";
import { QueueResponse } from "../../lib/sqs/type";
import { CacheKeyStatus } from "../../lib/enum";
import { QueueResponseStatus } from "../../lib/enum/queue";
import MessageQueue from "../sqs/MessageQueue";
import caches, { getCacheItem } from "../cache";

const queueController = async () => {
  
  if (_.isEmpty(caches[CacheKeyStatus.QUEUE_URLS])) {
    // 기존에 생성되어 있는 Message Queue들을 캐싱한다.
    const queues: any = await MessageQueue.getQueues();
    setCacheQueueUrls(queues);
  }
};

const setCacheQueueUrls = (queues: QueueResponse): void => {
  const queueUrls = createQueueUrls(queues);

  _.forEach(queueUrls, (queueUrl: string) => {
    caches[CacheKeyStatus.QUEUE_URLS].push(queueUrl);
  });
};

const createQueueUrls = (queues: QueueResponse): string[] => {
  return _.get(queues, QueueResponseStatus.QUEUE_URLS, []);
};

export const getCacheQueueUrls = (): string[] => {
  return getCacheItem(CacheKeyStatus.QUEUE_URLS, []);
};

export const getCacheQueueUrl = (queueUrl: string) => {
  const queuesUrls = getCacheQueueUrls().filter((cacheQueueUrl: string) => cacheQueueUrl === queueUrl);
  return _.get(queuesUrls, 0, "");
};

export default queueController;