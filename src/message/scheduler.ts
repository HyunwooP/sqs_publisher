import _ from "lodash";
import broker from "../broker";
import { getCacheItem, setCacheItem } from "../common/cache";
import CommonConstant from "../common/constant";
import { CacheKeys } from "../enum/cache";
import { ErrorStatus } from "../enum/error";
import queueController from "../queue";

export const startMessageScheduler = async (
  queueUrls: string[],
): Promise<void> => {
  try {
    await broker(queueUrls);

    const intervalPullingMessageId: NodeJS.Timer = setInterval(async () => {
      await broker(queueUrls);
    }, CommonConstant.MESSAGE_PULLING_TIME);

    setCacheItem({
      key: CacheKeys.INTERVAL_PULLING_MESSAGE_ID,
      value: intervalPullingMessageId,
    });
  } catch (error: unknown) {
    throw new Error(ErrorStatus.STOP_INTERVAL_PULLING_MESSAGE);
  }
};

export const clearMessageScheduler = (): void => {
  const intervalPullingMessageId = getCacheItem({
    key: CacheKeys.INTERVAL_PULLING_MESSAGE_ID,
    defaultValue: null,
  });

  if (!_.isNull(intervalPullingMessageId)) {
    clearInterval(intervalPullingMessageId);
    setCacheItem({
      key: CacheKeys.INTERVAL_PULLING_MESSAGE_ID,
      value: null,
    });
  }
};

export const restartMessageScheduler = async (): Promise<void> => {
  const { queueUrls } = await queueController();

  if (_.isEmpty(queueUrls)) {
    throw new Error(ErrorStatus.IS_EMPTY_QUEUE_URLS);
  }

  clearMessageScheduler();
  startMessageScheduler(queueUrls);
};

export const delayStartMessageScheduler = (delayTime?: number) => {
  const _delayTime =
    delayTime ??
    CommonConstant.DELAY_START_INTERVAL_TIME -
      CommonConstant.MESSAGE_PULLING_TIME;

  setTimeout(() => {
    restartMessageScheduler();
  }, _delayTime);
};
