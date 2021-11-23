import _ from "lodash";
import CommonEnum from "../enum";
import intervalController from "../message/interval";
import { AWSError } from "../sqs/type";

const errorController = (error: AWSError | any): void => {
  console.log('errorController로 들어오니?????????????');
  try {
    if (!_.isUndefined(error.code)) {
      awsErrorController(error);
    } else {
      appErrorController(error);
    }
  } catch(error: unknown) {
    console.error(`=========> throw Error!!! => ${error}`);
  }
};

const awsErrorController = (error: AWSError): void => {
  console.log(`awsErrorController ${error} ${error.code}`);
  awsErrorSelector(error);
};

const awsErrorSelector = (error:AWSError): void => {
  try {
    let errorMessage = error.message ?? "AWS SDK 에러입니다.";

    switch(error.code) {
      case CommonEnum.AWSErrorStatus.UN_KNOWN_ENDPOINT :
        errorMessage = "MQ 서버를 확인 해주시기 바랍니다.";
        break;
      default:
        intervalController.reStartIntervalPullingMessage();
        break;
    }

    throw errorMessage;
  } catch(errorMessage: unknown) {
    throw errorMessage;
  }
};

const appErrorController = (error: unknown): void => {
  console.log(`appErrorController ${error}`);
  appErrorSelector(appErrorSelector);
};

const appErrorSelector = (error: unknown): void => {
  try {
    let errorMessage = error ?? "서비스 장애입니다.";

    switch(error) {
      case CommonEnum.ErrorStatus.IS_NOT_VALID_REQUIRE_MESSAGE_PARAMS:
        errorMessage = "Message 객체에 필수 파라메터가 부족합니다.";
        break;
      case CommonEnum.ErrorStatus.MESSAGE_DELETE_FAILED:
        errorMessage = "메세지 삭제가 실패 했습니다.";
        break;
      case CommonEnum.ErrorStatus.STOP_INTERVAL_PULLING_MESSAGE:
        errorMessage = "풀링이 실패했습니다.";
        intervalController.reStartIntervalPullingMessage();
      default:
        intervalController.reStartIntervalPullingMessage();
        break;
    }

    throw errorMessage;
  } catch(errorMessage: unknown) {
    throw errorMessage;
  }
};

export default errorController;