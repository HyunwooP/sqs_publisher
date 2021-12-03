import _ from "lodash";
import MessageQueue from "../sqs/MessageQueue";

const publishController = (queueUrls: string[]): void => {
  if (!_.isEmpty(queueUrls)) {
    _.forEach(queueUrls, async (queueUrl: string): Promise<void> => {
      await sendMessage(queueUrl);
    });
  }
};

const sendMessage = async (queueUrl: string): Promise<void> => {
  const sampleMessages = {
    anyTokenRemoveAction: "deleteUserToken",
    targetTokenRemoveAction: "deleteUserToken/userACDED/a/b/c/d",
  };

  await MessageQueue.sendMessage({
    QueueUrl: queueUrl,
    MessageBody: sampleMessages.targetTokenRemoveAction,
  });
};

export default publishController;
