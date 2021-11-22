import _ from "lodash";
import { QueueResponseStatus } from "../../lib/enum/queue";
import { QueueControllerIE } from "../../lib/interface";
import {
  CreateQueueRequest,
  CreateQueueResult,
  QueueResponse,
} from "../../lib/sqs/type";
import MessageQueue from "../sqs/MessageQueue";

const queueController = async (): Promise<QueueControllerIE> => {
  // process...
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

const getQueueResponse = async (): Promise<QueueResponse> => {
  return await MessageQueue.getQueues();
};

const getQueueUrls = async (): Promise<string[]> => {
  const queueResponse: QueueResponse = await getQueueResponse();
  const queueUrls: string[] = createQueueUrls(queueResponse);

  return queueUrls;
};

const createQueueUrls = (
  queues: QueueResponse | CreateQueueResult,
): string[] => {
  return _.get(queues, QueueResponseStatus.QUEUE_URLS, []);
};

const createQueueUrl = (queues: QueueResponse | CreateQueueResult): string => {
  return _.get(queues, QueueResponseStatus.QUEUE_URL, "");
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
