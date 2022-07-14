import CommonConstant from "@/common/constant";
import { QueueResponseItem } from "@/enum/queue";
import _ from "lodash";
import { CreateDeadLetterQueueResult, QueueController } from "../common/type";
import config from "../config";
import MessageQueue from "../sqs/MessageQueue";
import {
  CreateQueueRequest,
  CreateQueueResult,
  GetQueueAttributesResult,
  ListQueuesResult,
} from "../sqs/type";
import {
  createQueueArn,
  createQueueUrl,
  defaultQueueAttributes,
  getQueueUrls,
} from "./preprocessor";

const queueController = async (): Promise<QueueController> => {
  let queueUrls: string[] = await getQueueUrls();
  let deadLetterQueueUrl: string = "";

  if (_.isEmpty(queueUrls)) {
    // * The DLQ Message does not move to the standard queue.
    const deadLetterQueueResponse: CreateDeadLetterQueueResult =
      await createDeadLetterQueue({
        QueueName: "DeadLetterQueue",
      });

    const deadLetterQueueArn = deadLetterQueueResponse.deadLetterQueueArn;
    deadLetterQueueUrl = deadLetterQueueResponse.deadLetterQueueUrl;

    const queueResponse: CreateQueueResult = await createQueue({
      QueueName: "DeleteActionQueue",
      Attributes: {
        RedrivePolicy: JSON.stringify({
          deadLetterTargetArn: deadLetterQueueArn,
          maxReceiveCount: CommonConstant.MAXIMUM_DEAD_LETTER_COUNT,
        }),
      },
    });

    queueUrls = [createQueueUrl(queueResponse)];
  }

  return {
    queueUrls,
    deadLetterQueueUrl,
  };
};

export const getQueues = async (): Promise<ListQueuesResult> => {
  return await MessageQueue.getQueues();
};

export const createQueue = async ({
  QueueName,
  Attributes,
}: CreateQueueRequest): Promise<CreateQueueResult> => {
  let attributes = {
    ...Attributes,
  };

  if (config.IS_SETUP_QUEUE_DEFAULT_ATTRIBUTES) {
    attributes = {
      ...defaultQueueAttributes,
      ...attributes,
    };
  }

  return await MessageQueue.createQueue({
    QueueName,
    Attributes: attributes,
  });
};

const createDeadLetterQueue = async ({
  QueueName,
}: {
  QueueName: string;
}): Promise<CreateDeadLetterQueueResult> => {
  let deadLetterQueueUrl,
    deadLetterQueueArn = "";

  const deadLetterQueueResponse: CreateQueueResult = await createQueue({
    QueueName,
  });

  deadLetterQueueUrl = createQueueUrl(deadLetterQueueResponse);
  const deadLetterQueueArnAttributes: GetQueueAttributesResult =
    await getQueueArn(deadLetterQueueUrl);
  deadLetterQueueArn = createQueueArn(deadLetterQueueArnAttributes);

  return {
    deadLetterQueueUrl,
    deadLetterQueueArn,
  };
};

const getQueueArn = async (
  queueUrl: string
): Promise<GetQueueAttributesResult> => {
  return await MessageQueue.getQueueAttributes({
    QueueUrl: queueUrl,
    AttributeNames: [QueueResponseItem.QUEUE_ARN],
  });
};

export const resetSQS = async (): Promise<void> => {
  await MessageQueue.resetQueue();
};

export default queueController;
