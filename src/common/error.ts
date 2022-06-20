import { processReStart } from "@/index";
import _ from "lodash";
import { AWSErrorStatus, ErrorStatus } from "../enum/error";
import { delayStartMessageScheduler } from "../message/scheduler";
import { AWSError } from "../sqs/type";

const errorController = (error: AWSError | any): void => {
  try {
    if (!_.isUndefined(error.originalError)) {
      awsErrorController(error);
    } else {
      appErrorController(error);
    }
  } catch ([errorMessage, action]) {
    console.error(
      `errorController Error =========> ${errorMessage} / next call = ${
        _.isNull(action) ? "없음" : action
      }`,
    );

    if (_.isFunction(action)) {
      action();
    }
  }
};

const awsErrorController = (error: AWSError): void => {
  awsErrorSelector(error);
};

const awsErrorSelector = (error: AWSError): void => {
  let action = null;

  switch (error.code) {
    case AWSErrorStatus.UN_KNOWN_ENDPOINT:
      action = () => process.exit(1);
      break;
    default:
      action = processReStart;
      break;
  }

  throw [error.originalError?.message ?? error.message, action];
};

const appErrorController = (error: any): void => {
  appErrorSelector(error);
};

const appErrorSelector = (error: any): void => {
  let errorMessage = error.message ?? error;
  let action = null;

  switch (errorMessage) {
    case ErrorStatus.IS_NOT_VALID_REQUIRE_MESSAGE_PARAMS:
      errorMessage = "Message 객체에 필수 파라메터가 부족합니다.";
      break;
    case ErrorStatus.IS_EMPTY_QUEUE_URLS:
      errorMessage = "등록된 Queue가 없습니다.";
      break;
    case ErrorStatus.MESSAGE_DELETE_FAILED:
      errorMessage = "메세지 삭제가 실패 했습니다.";
      break;
    case ErrorStatus.STOP_INTERVAL_PULLING_MESSAGE:
      errorMessage = "풀링이 실패했습니다.";
      action = delayStartMessageScheduler;
      break;
    case ErrorStatus.MAXIMUM_DELETE_COUNT_OVER:
      errorMessage = "삭제가 되지 않는 메세지가 있습니다.";
      break;
    case ErrorStatus.HTTP_REQUEST_PROTOCOL_ERROR:
      errorMessage = `메세지 전달 요청이 실패하였습니다.`;
      break;
    case ErrorStatus.HTTP_RESPONSE_PROTOCOL_ERROR:
      errorMessage = `메세지 전달 요청에 대한 응답이 없습니다.`;
      break;
  }

  throw [errorMessage, action];
};

export default errorController;
