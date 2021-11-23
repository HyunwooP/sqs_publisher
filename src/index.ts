import errorController from "./lib/common/error";
import worker from "./lib/worker";

(async (): Promise<void> => {
  try {
    await worker();
  } catch (error: unknown) {
    errorController(error);
  }
})();
