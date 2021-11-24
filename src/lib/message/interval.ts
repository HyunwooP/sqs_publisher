import _ from "lodash";
import { getMessageToDeleteWorker, sendSubScribeToMessage } from ".";
import { CacheKeyStatus, getCacheItem, setCacheItem } from "../common/cache";
import constant from "../common/constant";
import CommonEnum from "../enum";
import queueController from "../queue";

const intervalPullingMessage = (queueUrls: string[]): void => {
  try {
    const intervalPullingMessageId: NodeJS.Timer = setInterval(async () => {
      await intervalWorker(queueUrls);
    }, constant.MESSAGE_PULLING_TIME);

    setCacheItem({
      key: CacheKeyStatus.INTERVAL_PULLING_MESSAGE_ID,
      value: intervalPullingMessageId,
    });
  } catch (error: unknown) {
    throw new Error(CommonEnum.ErrorStatus.STOP_INTERVAL_PULLING_MESSAGE);
  }
};

const clearIntervalPullingMessage = (): void => {
  const intervalPullingMessageId = getCacheItem({
    key: CacheKeyStatus.INTERVAL_PULLING_MESSAGE_ID,
    defaultValue: null,
  });

  if (!_.isNull(intervalPullingMessageId)) {
    clearInterval(intervalPullingMessageId);
    setCacheItem({
      key: CacheKeyStatus.INTERVAL_PULLING_MESSAGE_ID,
      value: null,
    });
  }
};

const restartIntervalPullingMessage = async (): Promise<void> => {
  const { queueUrls } = await queueController();

  clearIntervalPullingMessage();
  intervalPullingMessage(queueUrls);
};

const delayStartIntervalPullingMessage = () => {
  const delayTime =
    constant.DELAY_START_INTERVAL_TIME - constant.MESSAGE_PULLING_TIME;

  setTimeout(() => {
    restartIntervalPullingMessage();
  }, delayTime);
};

const intervalWorker = async (queueUrls: string[]): Promise<void> => {
  const messageQueuesInMessage: string[] = await getMessageToDeleteWorker(
    queueUrls,
  );

  if (_.isEmpty(messageQueuesInMessage)) {
    const convertMSecondToSecond = Math.floor(
      constant.DELAY_START_INTERVAL_TIME / 1000,
    );
    console.log(
      `Message Queue has Non Message So, Set Delay ${convertMSecondToSecond} second`,
    );

    delayStartIntervalPullingMessage();
  } else {
    /**
     * @description
     * SQS에 등록된 모든 Message Queue들의 메세지를 꺼내서 전송하기 때문에,
     * 각각에 맞는 Subscribe Server가 존재한다면, 메세지 설계를 잘해야한다.
     */
    _.forEach(messageQueuesInMessage, (message: string) => {
      sendSubScribeToMessage(message);
    });
  }
};

const intervalController = {
  intervalPullingMessage,
  clearIntervalPullingMessage,
  restartIntervalPullingMessage,
};

export default intervalController;
