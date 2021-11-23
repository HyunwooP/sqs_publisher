import _ from "lodash";
import MessageQueue from "../sqs/MessageQueue";

const publisher = (queueUrls: string[]): void => {
  if (!_.isEmpty(queueUrls)) {
    // 등록되어있는 Message Queue에 Message Publishing
    _.forEach(queueUrls, async (queueUrl: string): Promise<void> => {
      await sendMessage(queueUrl);
    });
  }
};

const sendMessage = async (queueUrl: string): Promise<void> => {
  // todo: Action Message Template 정하기.
  const sampleMessage = "deleteAction";
  await MessageQueue.sendMessage({
    QueueUrl: queueUrl,
    MessageBody: sampleMessage,
  });
};

export default publisher;
