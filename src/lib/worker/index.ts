import WebSocket from "../protocol/ws";
import messageController from "../message";
import publisher from "../publisher";
import queueController from "../queue";
import { clearIntervalPullingMessage } from "../message/interval";

const worker = async (): Promise<void> => {
  
  /**
   * @description
   * Subscribe Server들에게 socket방식으로 message를 내려줄지에 대한 클래스 정의
   */
  if (process.env.IS_SEND_TO_SOCKET_SUBSCRIBE) {
    WebSocket.connect();
  }

  /**
   * @description
   * Message Queue 관리 컨트롤러
   * Message Queue가 이미 생성 되어 있다라는 가정하의 프로세스이다.
   */
  const { queueUrls } = await queueController();

  /**
   * @description
   * Message Queue에 샘플 메세지 넣어줌.
   * 따로 넣어주는 publisher가 없어서 해당 프로젝트에 테스트 겸 넣어둠.
   * ! 나중에는 뺄 예정. -> repository, package 이름 / 설정 바꾸기.
   */
  await publisher(queueUrls);

  /**
   * @description
   * Start Pulling Message
   * ? timer ? restful catch? socket catch?
   * ! timer로 설계를 안세울 수도 있어서, cron job은 따로 안쓴 상태
   */
  await messageController(queueUrls);
};

export const restartWorker = (): void => {
  clearIntervalPullingMessage();
  worker();
}

export default worker;
