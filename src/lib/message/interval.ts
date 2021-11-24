import _ from "lodash";
import { getMessageToDeleteWorker, sendSubScribeToMessage } from ".";
import { getCacheItem, setCacheItem } from "../common/cache";
import constant from "../common/constant";
import CommonEnum from "../enum";
import { restartWorker } from "../worker";

const intervalPullingMessage = async (queueUrls: string[]): Promise<void> => {
  try {
    // first shot
    const intervalPullingMessageId: NodeJS.Timer = setInterval(async () => {
      await intervalWorker(queueUrls);
    }, constant.MESSAGE_PULLING_TIME);

    setCacheItem(
      CommonEnum.CacheKeyStatus.INTERVAL_PULLING_MESSAGE_ID,
      intervalPullingMessageId,
    );
  } catch (error: unknown) {
    console.error(
      `============ intervalPullingMessage Error ============ ${error}`,
    );
    // todo: restart인지, clear인지 에러 로직에 대해서 고민해보기...
    throw new Error(CommonEnum.ErrorStatus.STOP_INTERVAL_PULLING_MESSAGE);
  }
};

export const clearIntervalPullingMessage = (): void => {
  const intervalPullingMessageId = getCacheItem(
    CommonEnum.CacheKeyStatus.INTERVAL_PULLING_MESSAGE_ID,
    null,
  );

  if (!_.isNull(intervalPullingMessageId)) {
    clearInterval(intervalPullingMessageId);
    setCacheItem(CommonEnum.CacheKeyStatus.INTERVAL_PULLING_MESSAGE_ID, null);
  }
};

const intervalWorker = async (queueUrls: string[]): Promise<void> => {
  const message: string = await getMessageToDeleteWorker(queueUrls);

  if (_.isEmpty(message)) {
    // todo: 없을 경우 1분 뒤에 다시 가져오는 프로세스로...
  }
  
  sendSubScribeToMessage(message);
};

const intervalController = {
  intervalPullingMessage,
  clearIntervalPullingMessage,
};

export default intervalController;
