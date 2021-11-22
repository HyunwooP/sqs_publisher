import _ from "lodash";
import { ErrorStatus } from "./enum";
import intervalController from "./message/interval";
import { AWSError } from "./sqs/type";

const errorController = (error: AWSError | any): void => {
  console.log(`errorController ${error}`);

  if (!_.isUndefined(error.code)) {
    awsErrorController(error);
  } else {
    appErrorController(error);
  }
};

const awsErrorController = (error: AWSError) => {
  console.log(`awsErrorController ${error}`);
  intervalController.reStartIntervalPullingMessage();
};

const appErrorController = (error: unknown) => {
  console.log(`appErrorController ${error}`);
  if (error === ErrorStatus.STOP_INTERVAL_PULLING_MESSAGE) {
    intervalController.reStartIntervalPullingMessage();
  }
};

export default errorController;
