import _ from "lodash";
import CommonConstant from "../common/constant";
import { QueueMessages } from "../common/type";
import { getMessageToDeleteWorker, sendMessageToSubscriber } from "../message";
import { delayStartMessageScheduler } from "../message/scheduler";
import { convertMsToSeconds } from "../utils/convert";

const broker = async (queueUrls: string[]): Promise<void> => {
  const messages = await getMessageToDeleteWorker(queueUrls);

  if (_.isEmpty(messages)) {
    const delaySeconds = convertMsToSeconds(
      CommonConstant.DELAY_START_INTERVAL_TIME
    );
    console.log(
      `Message Queue has Non Message So, Set Delay ${delaySeconds} second`
    );

    delayStartMessageScheduler();
  } else {
    sender(messages);
  }
};

const sender = (messages: QueueMessages): void => {
  const queueUrls = Object.keys(messages);

  _.forEach(queueUrls, (queueUrl: string) => {
    _.forEach(messages[queueUrl], (message: string) => {
      sendMessageToSubscriber(queueUrl, message);
    });
  });
};

export default broker;
