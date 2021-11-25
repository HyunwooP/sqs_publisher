import env from "../env";
import messageController from "../message";
import WebSocket from "../protocol/ws";
import publishController from "../publisher";
import queueController from "../queue";

const worker = async (): Promise<void> => {
  
  if (env.IS_SEND_TO_SOCKET_SUBSCRIBE) {
    WebSocket.connect();
  }

  const { queueUrls } = await queueController();
  
  await publishController(queueUrls);
  
  await messageController(queueUrls);
};

export default worker;
