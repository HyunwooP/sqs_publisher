import broker from "@/broker";
import config from "@/config";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import { Server } from "http";
import path from "path";

export const getExpressServer = (): Server => {
  const app: Application = createExpress();
  return listenExpressServer(app);
};

export const createExpressServer = (queueUrls: string[]): void => {
  const app: Application = createExpress();
  createRouteWorker(app, queueUrls);
  listenExpressServer(app);
};

const createExpress = (): Application => {
  const app: Application = express();

  const corsConfig = {
    // * publisher servers origin / subscribe servers origin
    origin: [config.SUB_SCRIBE_A_SERVER_ORIGIN, config.PUBLISHER_SERVER_ORIGIN],
    credentials: true,
  };

  app.use(helmet());
  app.use(cors(corsConfig));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "public")));

  return app;
};

const listenExpressServer = (app: Application): Server => {
  return app.listen(config.PORT, () => {
    console.log(`SQS SERVER PORT ${config.PORT}`);
  });
};

const createRouteWorker = (app: Application, queueUrls: string[]): void => {
  app.post("/deleteMessage", async (request: Request, response: Response) => {
    try {
      await broker(queueUrls);

      response.status(200);
      response.send("queueUrls Message is Deleted");
    } catch (error: any) {
      // todo: error code 작성하기.
      // todo: error 공통 타입 작성하기.
      response.status(500);
      response.send(`queueUrls Message is Deleted - ${error.message ?? error}`);
    }
  });
};
