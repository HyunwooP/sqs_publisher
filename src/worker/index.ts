import _ from "lodash";
import { ErrorStatus } from "../common/enum/error";
import messageController, {
  showMaximumDeleteCountOverMessages
} from "../message";
import publishController from "../publisher";
import queueController from "../queue";
import applicationController from "./application";

const worker = async (): Promise<void> => {
  const { queueUrls, deadLetterQueueUrl } = await queueController();
  const totalQueueUrls = [...queueUrls, deadLetterQueueUrl];

  if (_.isEmpty(totalQueueUrls)) {
    throw new Error(ErrorStatus.IS_EMPTY_QUEUE_URLS);
  }

  await applicationController(totalQueueUrls);

  // * 외부에서 sqs에 publish 해주면 제거 & deadLetterQueue는 테스트 메세지 안넣기 위해 따로 넣음.
  await publishController(queueUrls);

  await messageController(totalQueueUrls);

  await showMaximumDeleteCountOverMessages();
};

export default worker;
