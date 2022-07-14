import _ from "lodash";
import { getQueues } from ".";
import { QueueAttributes } from "../common/type";
import { QueueResponseItem } from "../enum/queue";
import {
  CreateQueueResult,
  GetQueueAttributesResult,
  ListQueuesResult,
} from "../sqs/type";

export const defaultQueueAttributes: QueueAttributes = {
  FifoQueue: "true",
  ContentBasedDeduplication: "true",
};

export const getQueueUrls = async (): Promise<string[]> => {
  const queueResponse: ListQueuesResult = await getQueues();
  return createQueueUrls(queueResponse);
};

export const createQueueUrls = (
  queues: ListQueuesResult | CreateQueueResult
): string[] => {
  return _.get(queues, QueueResponseItem.QUEUE_URLS, []);
};

export const createQueueUrl = (
  queues: ListQueuesResult | CreateQueueResult
): string => {
  return _.get(queues, QueueResponseItem.QUEUE_URL, "");
};

export const createQueueArn = (
  attributesResult: GetQueueAttributesResult
): string => {
  return _.get(attributesResult.Attributes, QueueResponseItem.QUEUE_ARN, "");
};
