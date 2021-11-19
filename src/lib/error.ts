import _ from 'lodash';
import cache from './cache';
import { ErrorStatus } from "./enum";

const errorController = (error: any) => {
  console.log(`errorController ${error}`);
  if (error === ErrorStatus.STOP_INTERVAL_PULLING_MESSAGE) {
    clearIntervalPullingMessage();
  }
};

const clearIntervalPullingMessage = () => {
  if (!_.isNull(cache.intervalPullingMessageId)) {
    clearInterval(cache.intervalPullingMessageId);
    cache.intervalPullingMessageId = null;
  }
};

export default errorController;