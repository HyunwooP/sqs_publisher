import _ from "lodash";
import ws from "ws";
import httpController from "../express";

class WebSocket {
  private readonly wss: ws.WebSocketServer = new ws.Server({
    server: httpController(),
  });
  private ws!: ws.WebSocket;

  connect = (): void => {
    if (!_.isEmpty(this.wss)) {
      this.wss.on("connection", (ws: ws.WebSocket): void => {
        this.ws = ws;

        // * connection하면 listener 등록.
        this.onMessage();
        this.onError();
      });
    }
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
