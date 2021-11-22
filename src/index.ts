import errorController from "./lib/error";
import worker from "./lib/worker";

(async (): Promise<void> => {
  try {
    await worker();
  } catch (error: unknown) {
    errorController(error);
    throw error;
  }
})();
