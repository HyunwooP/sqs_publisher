import _ from "lodash";
import MessageQueue from "../../lib/sqs/MessageQueue";
import { getCacheQueueUrls } from "../../lib/queue";

const publisher = (): void => {
  
  const queueUrls: string[] = getCacheQueueUrls();

  if (!_.isEmpty(queueUrls)) {
    // 등록되어있는 Message Queue에 Message Publishing
    _.forEach(queueUrls, async (queueUrl: string): Promise<void> => {
      await setMessage(queueUrl);
    });
  }
};

const setMessage = (queueUrl: string): void => {
  // todo: Action Message Template 정하기.
  const sampleMessages = [
    '지우시오!',
    '생성하시오!',
    '변경하시오!',
  ]

  _.forEach(sampleMessages, (sampleMessage: string) => {
    MessageQueue.sendMessage({
      QueueUrl: queueUrl,
      MessageBody: sampleMessage
    });
  });
};

export default publisher;