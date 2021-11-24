import errorController from "./lib/common/error";
import { AWSError } from "./lib/sqs/type";
import worker from "./lib/worker";

((): void => {
  try {
    worker();
  } catch (error: AWSError | any) {
    errorController(error);
  }
})();
