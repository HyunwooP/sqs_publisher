import _ from "lodash";
import { CreateQueueRequest, CreateQueueResponse, QueueResponse } from "../../lib/sqs/type";
import { QueueResponseStatus } from "../../lib/enum/queue";
import MessageQueue from "../sqs/MessageQueue";

// todo: return interface 만들기.
const queueController = async () => {
  // process...
  let queueUrls: string[] = await getQueueUrls();

  if (_.isEmpty(queueUrls)) {
    const queueResponse = await createQueue({ QueueName: "TEST_MESSAGE_QUEUE" });
    queueUrls = [ createQueueUrl(queueResponse) ];
  }
  
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

const createQueue = async ({
  QueueName,
  Attributes
}: CreateQueueRequest) : Promise<CreateQueueResponse> => {
  return await MessageQueue.createQueue({
    QueueName,
    Attributes
  });
};

const createQueueUrls = (queues: QueueResponse | CreateQueueResponse): string[] => {
  return _.get(queues, QueueResponseStatus.QUEUE_URLS, []);
};

const createQueueUrl = (queues: QueueResponse | CreateQueueResponse): string => {
  return _.get(queues, QueueResponseStatus.QUEUE_URL, "");
};

export default queueController;