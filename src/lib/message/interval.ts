import _ from "lodash";
import { sender } from ".";
import { CacheKeyStatus, getCacheItem, setCacheItem } from "../common/cache";
import CommonConstant from "../common/constant";
import CommonEnum from "../enum";
import queueController from "../queue";

const intervalPullingMessage = (queueUrls: string[]): void => {
  try {
    const intervalPullingMessageId: NodeJS.Timer = setInterval(async () => {
      await sender(queueUrls);
    }, CommonConstant.MESSAGE_PULLING_TIME);

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
    CommonConstant.DELAY_START_INTERVAL_TIME -
    CommonConstant.MESSAGE_PULLING_TIME;

  setTimeout(() => {
    restartIntervalPullingMessage();
  }, delayTime);
};

const intervalController = {
  intervalPullingMessage,
  clearIntervalPullingMessage,
  restartIntervalPullingMessage,
};

export default intervalController;
