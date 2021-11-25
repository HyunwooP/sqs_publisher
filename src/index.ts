import errorController from "./lib/common/error";
import { AWSError } from "./lib/sqs/type";
import worker from "./lib/worker";

export const processStart = async (): Promise<void> => {
  try {
    await worker();
  } catch (error: AWSError | unknown) {
    errorController(error);
  }
};

export const processReStart = async (): Promise<void> => {
  await processStart();
};

processStart();
