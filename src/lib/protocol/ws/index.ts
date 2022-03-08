import _ from "lodash";
import ws from "ws";
import { getExpressServer } from "../express";

class WebSocket {
  private wss!: ws.WebSocketServer;
  private ws!: ws.WebSocket;

  connect = async (): Promise<void> => {
    await this.connectWss();
    await this.connectWs();
  };

  connectWss = () => {
    this.wss = new ws.Server({
      server: getExpressServer(),
    });
  };

  connectWs = () => {
    this.wss.on("connection", (ws: ws.WebSocket): void => {
      this.ws = ws;

      // * connection하면 listener 등록.
      this.onMessage();
      this.onError();
    });
  };

  close = (callback?: (error: Error | undefined) => void): void => {
    if (!_.isEmpty(this.wss)) {
      this.wss.close(callback);
    }
  };

  onMessage = (): void => {
    if (!_.isEmpty(this.ws)) {
      this.ws.on("message", (message: string): void => {
        console.log(`Subscribe Message: ${message}`);
      });
    }
  };

  onError = (callback?: (error: Error) => void): void => {
    if (!_.isEmpty(this.ws)) {
      this.ws.on("error", (error: Error): void => {
        console.log(`WebSocket Error ${error}`);

        if (_.isFunction(callback)) {
          callback(error);
        }

        throw error;
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
