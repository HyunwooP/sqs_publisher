import _ from "lodash";
import { messageBroker } from ".";
import { CacheKeyStatus, getCacheItem, setCacheItem } from "../common/cache";
import CommonConstant from "../common/constant";
import CommonEnum from "../enum";
import queueController from "../queue";

export const startMessageScheduler = (queueUrls: string[]): void => {
  try {
    const intervalPullingMessageId: NodeJS.Timer = setInterval(async () => {
      await messageBroker(queueUrls);
    }, CommonConstant.MESSAGE_PULLING_TIME);

    setCacheItem({
      key: CacheKeyStatus.INTERVAL_PULLING_MESSAGE_ID,
      value: intervalPullingMessageId,
    });
  } catch (error: unknown) {
    throw new Error(CommonEnum.ErrorStatus.STOP_INTERVAL_PULLING_MESSAGE);
  }
};

export const clearMessageScheduler = (): void => {
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

export const restartMessageScheduler = async (): Promise<void> => {
  const { queueUrls } = await queueController();

  clearMessageScheduler();
  startMessageScheduler(queueUrls);
};

export const delayStartMessageScheduler = () => {
  const delayTime =
    CommonConstant.DELAY_START_INTERVAL_TIME -
    CommonConstant.MESSAGE_PULLING_TIME;

  setTimeout(() => {
    restartMessageScheduler();
  }, delayTime);
};
