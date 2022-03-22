import config from "../config";
import messageController from "../message";
import { showMaximumDeleteCountOverMessages } from "../message/preprocessor";
import { createExpressServer } from "../protocol/express";
import WebSocket from "../protocol/ws";
import publishController from "../publisher";
import queueController from "../queue";

const worker = async (): Promise<void> => {
  const { queueUrls } = await queueController();

  if (config.IS_SEND_TO_SOCKET_SUBSCRIBE) {
    console.log("STATEFUL SUBSCRIBE MESSAGE");
    await WebSocket.connect();
  } else {
    console.log("STATELESS SUBSCRIBE MESSAGE");
    createExpressServer(queueUrls);
  }

  await publishController(queueUrls);

  await messageController(queueUrls);

  await showMaximumDeleteCountOverMessages();
};

export default worker;
