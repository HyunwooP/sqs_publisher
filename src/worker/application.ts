import config from "@/config";
import { createExpressServer } from "@/protocol/express";
import WebSocket from "../protocol/ws";

const applicationController = async (queueUrls: string[]): Promise<void> => {
  if (config.IS_SEND_TO_SOCKET_SUBSCRIBE) {
    console.log("STATEFUL SUBSCRIBE MESSAGE");
    await WebSocket.connect();
  } else {
    console.log("STATELESS SUBSCRIBE MESSAGE");
    createExpressServer(queueUrls);
  }
}

export default applicationController;