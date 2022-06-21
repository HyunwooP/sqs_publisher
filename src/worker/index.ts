import _ from "lodash";
import { ErrorStatus } from "../enum/error";
import messageController from "../message";
import { showMaximumDeleteCountOverMessages } from "../message/preprocessor";
import publishController from "../publisher";
import queueController from "../queue";
import applicationController from "./application";


const worker = async (): Promise<void> => {
  const { queueUrls, deadLetterQueueUrl } = await queueController();
  const totalQueueUrls = [ ...queueUrls, deadLetterQueueUrl ];

  if (!_.isEmpty(totalQueueUrls)) {
    throw new Error(ErrorStatus.IS_EMPTY_QUEUE_URLS);
  }

  await applicationController(totalQueueUrls);

  // * 외부에서 sqs에 publish 해주면 제거
  await publishController(totalQueueUrls);

  await messageController(totalQueueUrls);

  await showMaximumDeleteCountOverMessages();
};

export default worker;
