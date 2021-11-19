import { intervalPullingMessage } from "./lib/message";
import queueController from "./lib/queue";
import errorController from "./lib/error";
import publisher from "./lib/publisher";

(async () => {
  try {
    /**
     * @description
     * Message Queue 관리 컨트롤러
     * Message Queue가 이미 생성 되어 있다라는 가정하의 프로세스이다.
     */
    await queueController();

    /**
     * Message Queue에 샘플 메세지 넣어줌.
     * 따로 넣어주는 publisher가 없어서 해당 프로젝트에 테스트 겸 넣어둠.
     * ! 나중에는 뺄 예정.
     */
    await publisher();
    
    /**
     * Start Pulling Message
     * ? timer ? restful catch? socket catch?
     * ! timer로 설계를 안세울 수도 있어서, cron job은 따로 안쓴 상태
     */
    await intervalPullingMessage();
    
  } catch(error) {
    errorController(error);
  }
})();
