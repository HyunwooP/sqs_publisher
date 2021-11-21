import worker from "./lib/worker";
import errorController from "./lib/error";

(async (): Promise<void> => {
  try {
    await worker();
  } catch(error) {
    errorController(error);
  }
})();
