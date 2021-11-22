import _ from "lodash";
import { getMessageQueueInMessages } from ".";
import { getCacheItem, setCacheItem } from "../../lib/cache";
import { CacheKeyStatus, ErrorStatus } from "../../lib/enum";
import constant from "../constant";
import worker from "../../lib/worker";

const intervalPullingMessage = async (queueUrls: string[]): Promise<void> => {
  try {
    // first shot
    await getMessageQueueInMessages(queueUrls);

    const intervalPullingMessageId: NodeJS.Timer = setInterval(
      async() => {
        await getMessageQueueInMessages(queueUrls);
    }, constant.MESSAGE_PULLING_TIME);

    setCacheItem(CacheKeyStatus.INTERVAL_PULLING_MESSAGE_ID, intervalPullingMessageId);
  } catch(error) {
    console.error(`============ intervalPullingMessage Error ============ ${error}`);
    // todo: restart인지, clear인지 에러 로직에 대해서 고민해보기...
    throw new Error(ErrorStatus.STOP_INTERVAL_PULLING_MESSAGE);
  }
};

const clearIntervalPullingMessage = (): void => {
  const intervalPullingMessageId = getCacheItem(CacheKeyStatus.INTERVAL_PULLING_MESSAGE_ID, null);
  if (!_.isNull(intervalPullingMessageId)) {
    clearInterval(intervalPullingMessageId);
    setCacheItem(CacheKeyStatus.INTERVAL_PULLING_MESSAGE_ID, null);
  }
};

const reStartIntervalPullingMessage = (): void => {
  clearIntervalPullingMessage();
  worker();
};

const intervalController = {
  intervalPullingMessage,
  clearIntervalPullingMessage,
  reStartIntervalPullingMessage
};

export default intervalController;