import _ from "lodash";
import { getMessageToDeleteWorker, sendSubScribeToMessage } from ".";
import { getCacheItem, setCacheItem } from "../common/cache";
import constant from "../common/constant";
import CommonEnum from "../enum";
import queueController from "../queue";

const intervalPullingMessage = async (queueUrls: string[]): Promise<void> => {
  try {
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
    console.log(`Message Queue has Non Message So, Set Delay ${constant.DELAY_INTERVAL_TIME} seconds`);
    delayStartIntervalPullingMessage();
  } else {
    sendSubScribeToMessage(message);
  }
};

const delayStartIntervalPullingMessage = async () => {
  const { queueUrls } = await queueController();
  
  /**
   * @description
   * 1분 뒤에 Interval 한다고 했을 때, intervalPullingMessage안에
   * setInterval에는 MESSAGE_PULLING_TIME가 선언되어 있으므로, setTimeout에서는 그것을 감안한 time값이 들어가야한다.
   * 그게 아니면 1분 30초 뒤에 Interval할 것이다.
   */
  const delayTime = constant.DELAY_INTERVAL_TIME - constant.MESSAGE_PULLING_TIME;

  clearIntervalPullingMessage();
  setTimeout(async () => {
    await intervalPullingMessage(queueUrls)
  }, delayTime);
};

const intervalController = {
  intervalPullingMessage,
  clearIntervalPullingMessage,
};

export default intervalController;
