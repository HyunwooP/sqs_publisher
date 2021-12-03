import env from "../env";
import messageController from "../message";
import { showMaximumDeleteCountOverMessages } from "../message/preprocessor";
import WebSocket from "../protocol/ws";
import publishController from "../publisher";
import queueController from "../queue";

const worker = async (): Promise<void> => {
  if (env.IS_SEND_TO_SOCKET_SUBSCRIBE) {
    WebSocket.connect();
    console.log("StateFul Send Message");
  } else {
    console.log("StateLess Send Message");
  }

  const { queueUrls } = await queueController();

  await publishController(queueUrls);

  await messageController(queueUrls);

  await showMaximumDeleteCountOverMessages();
};

export default worker;
