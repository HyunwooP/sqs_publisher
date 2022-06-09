import _ from "lodash";
import config from "../config";
import { sendMessage } from "../message";

const publishController = (queueUrls: string[]): void => {
  _.forEach(queueUrls, async (queueUrl: string): Promise<void> => {
    await publisher(queueUrl);
  });
};

const publisher = async (queueUrl: string): Promise<void> => {
  // const split = config.PARAMS_SPLIT_TYPE;
  const tokenRemoveAction = {
    endPoint: `${config.SUB_SCRIBE_A_SERVER_ORIGIN}/deleteUserToken`,
    // params: `userACDED${split}a${split}b${split}c${split}d`,
  };

  sendMessage(queueUrl, JSON.stringify(tokenRemoveAction));
};

export default publishController;
