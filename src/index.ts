import errorController from "./lib/common/error";
import worker from "./lib/worker";

((): void => {
  try {
    worker();
  } catch (error: unknown) {
    errorController(error);
  }
})();
