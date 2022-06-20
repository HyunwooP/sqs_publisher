import "module-alias/register";
import errorController from "./common/error";
import { AWSError } from "./sqs/type";
import worker from "./worker";

const processStart = async (): Promise<void> => {
  try {
    await worker();
  } catch (error: AWSError | unknown) {
    errorController(error);
  }
};

export const processReStart = (): void => {
  processStart();
};

processStart();
