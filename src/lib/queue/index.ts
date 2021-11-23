import _ from "lodash";
import { QueueControllerIE } from "../common/interface";
import {
  CreateQueueRequest,
  CreateQueueResult,
  QueueResponse,
} from "../sqs/type";
import MessageQueue from "../sqs/MessageQueue";
import { createQueueUrl, getQueueUrls } from "./preprocessor";

const queueController = async (): Promise<QueueControllerIE> => {
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
    Attributes,
  });
};

export default queueController;
