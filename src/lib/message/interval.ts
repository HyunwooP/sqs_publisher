import _ from "lodash";
import { getMessageToDeleteWorker } from ".";
import { getCacheItem, setCacheItem } from "../../lib/cache";
import { CacheKeyStatus, ErrorStatus } from "../../lib/enum";
import worker from "../../lib/worker";
import constant from "../constant";

const intervalPullingMessage = async (queueUrls: string[]): Promise<void> => {
  try {
    // first shot
    const intervalPullingMessageId: NodeJS.Timer = setInterval(async () => {
      await intervalWorker(queueUrls);
    }, constant.MESSAGE_PULLING_TIME);

    setCacheItem(
      CacheKeyStatus.INTERVAL_PULLING_MESSAGE_ID,
      intervalPullingMessageId,
    );
  } catch (error: unknown) {
    console.error(
      `============ intervalPullingMessage Error ============ ${error}`,
    );
    // todo: restart인지, clear인지 에러 로직에 대해서 고민해보기...
    throw new Error(ErrorStatus.STOP_INTERVAL_PULLING_MESSAGE);
  }
};

const clearIntervalPullingMessage = (): void => {
  const intervalPullingMessageId = getCacheItem(
    CacheKeyStatus.INTERVAL_PULLING_MESSAGE_ID,
    null,
  );

  if (!_.isNull(intervalPullingMessageId)) {
    clearInterval(intervalPullingMessageId);
    setCacheItem(CacheKeyStatus.INTERVAL_PULLING_MESSAGE_ID, null);
  }
};

const reStartIntervalPullingMessage = (): void => {
  clearIntervalPullingMessage();
  worker();
};

const intervalWorker = async (queueUrls: string[]): Promise<void> => {
  // todo: 얻어오고 지워냈으므로, 애네들을 SubScribe Server로 보내야함.
  const messageItem: string[] = await getMessageToDeleteWorker(queueUrls);

  if (_.isEmpty(messageItem)) {
    // todo: 없을 경우 1분 뒤에 다시 가져오는 프로세스로...
  }

  console.log(`go subscribe ==============>`);
  console.log(messageItem);
};

const intervalController = {
  intervalPullingMessage,
  clearIntervalPullingMessage,
  reStartIntervalPullingMessage,
};

export default intervalController;
