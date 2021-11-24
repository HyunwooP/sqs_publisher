import _ from "lodash";
import ws from "ws";
import httpController from "./httpServer";

class WebSocket {
  private readonly wss: ws.WebSocketServer = new ws.Server({ server: httpController() });
  private ws: ws.WebSocket;

  connect = (): void => {
    if (!_.isEmpty(this.wss)) {
      this.wss.on("connection", (ws: ws.WebSocket) => {
        this.ws = ws;
        // connection하면, 소켓별로 message listener 등록.
        this.onMessage();
      });
    }
  };

  close = (callback?: (error: Error) => void) => {
    if (!_.isEmpty(this.wss)) {
      this.wss.close(callback);
    }
  };

  onMessage = (): void => {
    if (!_.isEmpty(this.ws)) {
      this.ws.on("message", (message: string) => {
        console.log(`SubScribe Message: ${message}`);
      });
    }
  };

  sendMessage = (message: string): void => {
    if (!_.isEmpty(this.ws)) {
      this.ws.send(message);
    }
  };
}

export default new WebSocket();