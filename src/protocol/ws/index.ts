import config from "@/config";
import _ from "lodash";
import ws from "ws";
import { getExpressServer } from "../express";

class WebSocket {
  private wss!: ws.WebSocketServer;
  private ws!: ws.WebSocket;

  async connect(): Promise<void> {
    await this.createWebSocketServer();
    await this.onConnectWebSocket();
  }

  close(callback?: (error: Error | undefined) => void): void {
    if (!_.isEmpty(this.wss)) {
      this.wss.close(callback);
    }
  }

  sendMessage(message: string): void {
    if (!_.isEmpty(this.ws)) {
      this.ws.send(message);
    }
  }

  private createWebSocketServer(): void {
    this.wss = new ws.Server({
      server: getExpressServer(),
    });
  }

  private onConnectWebSocket(): void {
    this.wss.on("connection", (ws: ws.WebSocket): void => {
      this.ws = ws;

      // * connection하면 listener 등록.
      this.onMessage();
      this.onError();
      this.onClose();
    });
  }

  private onMessage(): void {
    if (!_.isEmpty(this.ws)) {
      this.ws.on("message", (message: string): void => {
        console.log(`${config.SUB_SCRIBE_A_SERVER_ORIGIN} MESSAGE: ${message}`);
      });
    }
  }

  private onClose(): void {
    if (!_.isEmpty(this.ws)) {
      this.ws.on("close", (): void => {
        console.log(`${config.SUB_SCRIBE_A_SERVER_ORIGIN} CLOSE`);
      });
    }
  }

  private onError(callback?: (error: Error) => void): void {
    if (!_.isEmpty(this.ws)) {
      this.ws.on("error", (error: Error): void => {
        console.log(`${config.SUB_SCRIBE_A_SERVER_ORIGIN} ERROR: ${error}`);

        if (_.isFunction(callback)) {
          callback(error);
        }

        throw error;
      });
    }
  }
}

export default new WebSocket();
