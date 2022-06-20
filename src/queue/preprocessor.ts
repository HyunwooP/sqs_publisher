import _ from "lodash";
import { getQueueResponse } from ".";
import { QueueAttributes } from "../common/type";
import { QueueResponseItem } from "../enum/queue";
import { CreateQueueResult, QueueResponse } from "../sqs/type";

export const defaultQueueAttributes: QueueAttributes = {
  FifoQueue: "true",
  ContentBasedDeduplication: "true",
};

export const getQueueUrls = async (): Promise<string[]> => {
  const queueResponse: QueueResponse = await getQueueResponse();
  return createQueueUrls(queueResponse);
};

export const createQueueUrls = (
  queues: QueueResponse | CreateQueueResult,
): string[] => {
  return _.get(queues, QueueResponseItem.QUEUE_URLS, []);
};

export const createQueueUrl = (
  queues: QueueResponse | CreateQueueResult,
): string => {
  return _.get(queues, QueueResponseItem.QUEUE_URL, "");
};
