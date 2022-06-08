import _ from "lodash";
import { QueueController } from "../common/type";
import config from "../config";
import MessageQueue from "../sqs/MessageQueue";
import {
  CreateQueueRequest,
  CreateQueueResult, QueueResponse
} from "../sqs/type";
import { createQueueUrl, defaultQueueAttributes, getQueueUrls } from "./preprocessor";

const queueController = async (): Promise<QueueController> => {
  let queueUrls: string[] = await getQueueUrls();

  if (_.isEmpty(queueUrls)) {
    const queueResponse: CreateQueueResult = await createQueue({
      QueueName: "DeleteActionQueue",
    });
    queueUrls = [createQueueUrl(queueResponse)];
  }

  return {
    queueUrls,
  };
};

export const getQueueResponse = async (): Promise<QueueResponse> => {
  return await MessageQueue.getQueues();
};

export const createQueue = async ({
  QueueName,
  Attributes,
}: CreateQueueRequest): Promise<CreateQueueResult> => {
  return await MessageQueue.createQueue({
    QueueName,
    Attributes: config.IS_SETUP_QUEUE_DEFAULT_ATTRIBUTES
      ? {
        ...defaultQueueAttributes,
        ...Attributes
      }
      : Attributes
  });
};

export default queueController;
