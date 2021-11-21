import _ from 'lodash';
import { ErrorStatus } from "./enum";
import { reStartIntervalPullingMessage } from './message';

const errorController = (error: any): void => {
  console.log(`errorController ${error}`);
  if (error === ErrorStatus.STOP_INTERVAL_PULLING_MESSAGE) {
    reStartIntervalPullingMessage();
  }
};

export default errorController;