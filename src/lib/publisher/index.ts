import _ from "lodash";
import env from "../env";
import MessageQueue from "../sqs/MessageQueue";

const publishController = (queueUrls: string[]): void => {
  if (!_.isEmpty(queueUrls)) {
    _.forEach(queueUrls, async (queueUrl: string): Promise<void> => {
      await sendMessage(queueUrl);
    });
  }
};

const sendMessage = async (queueUrl: string): Promise<void> => {
  const anyTokenRemoveAction = {
    endPoint: `${env.SUB_SCRIBE_A_SERVER_ORIGIN}/deleteUserToken`,
  }
  const targetTokenRemoveAction = {
    endPoint: `${env.SUB_SCRIBE_A_SERVER_ORIGIN}/deleteUserToken`,
    params: `userACDED${env.PARAMS_SPLIT_TYPE}a${env.PARAMS_SPLIT_TYPE}b${env.PARAMS_SPLIT_TYPE}c${env.PARAMS_SPLIT_TYPE}d`
  } 

  await MessageQueue.sendMessage({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(anyTokenRemoveAction),
  });
};

export default publishController;
