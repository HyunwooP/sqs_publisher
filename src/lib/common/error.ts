import _ from "lodash";
import CommonEnum from "../enum";
import { AWSError } from "../sqs/type";
import { restartWorker } from "../worker";

const errorController = (error: AWSError | any): void => {
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
  let errorMessage = error.message ?? "AWS SDK 에러입니다.";

  switch(error.code) {
    case CommonEnum.AWSErrorStatus.UN_KNOWN_ENDPOINT :
      errorMessage = "MQ 서버를 확인 해주시기 바랍니다.";
      break;
    default:
      restartWorker();
      break;
  }

  throw errorMessage;
};

const appErrorController = (error: unknown): void => {
  console.log(`appErrorController ${error}`);
  appErrorSelector(error);
};

const appErrorSelector = (error: unknown): void => {
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
      restartWorker();
    default:
      restartWorker();
      break;
  }

  throw errorMessage;
};

export default errorController;
