import _ from "lodash";
import { getQueueResponse } from ".";
import { CreateQueueResult, QueueResponse } from "../sqs/type";
import CommonEnum from "../enum";

export const getQueueUrls = async (): Promise<string[]> => {
  const queueResponse: QueueResponse = await getQueueResponse();
  const queueUrls: string[] = createQueueUrls(queueResponse);

  return queueUrls;
};

export const createQueueUrls = (
  queues: QueueResponse | CreateQueueResult,
): string[] => {
  return _.get(queues, CommonEnum.QueueResponseStatus.QUEUE_URLS, []);
};

export const createQueueUrl = (queues: QueueResponse | CreateQueueResult): string => {
  return _.get(queues, CommonEnum.QueueResponseStatus.QUEUE_URL, "");
};