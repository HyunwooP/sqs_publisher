import CommonConstant from "@/common/constant";
import _ from "lodash";
import { QueueController } from "../common/type";
import config from "../config";
import MessageQueue from "../sqs/MessageQueue";
import {
  CreateQueueRequest,
  CreateQueueResult,
  GetQueueAttributesResult,
  ListQueuesResult
} from "../sqs/type";
import {
  createQueueArn,
  createQueueUrl,
  defaultQueueAttributes,
  getQueueUrls
} from "./preprocessor";

const queueController = async (): Promise<QueueController> => {
  let deadLetterQueueUrl = config.DEAD_LATTER_QUEUE_URL;
  let deadLetterQueueArn = config.DEAD_LATTER_QUEUE_ARN;
  let queueUrls: string[] = await getQueueUrls();
  
  // * 둘중에 하나라도 없으면, 그냥 새로 생성...
  if (_.isEmpty(deadLetterQueueUrl) || _.isEmpty(deadLetterQueueArn)) {
    const deadLetterQueueResponse: CreateQueueResult = await createQueue({
      QueueName: "DeadLetterQueue",
    });
    
    deadLetterQueueUrl = createQueueUrl(deadLetterQueueResponse);
    const deadLetterQueueArnAttributes: GetQueueAttributesResult = await getQueueArn(deadLetterQueueUrl);
    deadLetterQueueArn = createQueueArn(deadLetterQueueArnAttributes);
  }
  
  if (_.isEmpty(queueUrls)) {
    const queueResponse: CreateQueueResult = await createQueue({
      QueueName: "DeleteActionQueue",
      Attributes: {
        RedrivePolicy: `{"deadLetterTargetArn":${deadLetterQueueArn},' + '"maxReceiveCount":${CommonConstant.MAXIMUM_DEAD_LETTER_COUNT}}`,
      }
    });
    
    queueUrls = [createQueueUrl(queueResponse)];
  }

  return {
    queueUrls,
    deadLetterQueueUrl
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
    }
  }

  return await MessageQueue.createQueue({
    QueueName,
    Attributes: attributes
  });
};

export const getQueueArn = async (queueUrl: string): Promise<GetQueueAttributesResult> => {
  return await MessageQueue.getQueueAttributes({
    QueueUrl: queueUrl,
    AttributeNames: ["QueueArn"]
  });
};

export default queueController;
