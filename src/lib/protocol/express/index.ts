import env from "@/lib/env";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import { Server } from "http";
import path from "path";
import { sender } from "../../message";

export const getExpressServer = (): Server => {
  const app: Application = createExpress();
  return listenExpressServer(app);
};

export const createExpressServer = (queueUrls: string[]): Server => {
  const app: Application = createExpress();
  createRouteWorker(app, queueUrls);
  return listenExpressServer(app);
};

const createExpress = (): Application => {
  const app: Application = express();

  const corsConfig = {
    // * publisher servers origin / subscribe servers origin
    origin: [env.SUB_SCRIBE_A_SERVER_ORIGIN, env.PUBLISHER_SERVER_ORIGIN],
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
  const port = env.SQS_SERVER_PORT;
  return app.listen(port, () => {
    console.log(`SQS SERVER PORT ${port}`);
  });
};

const createRouteWorker = (app: Application, queueUrls: string[]): void => {
  app.post("/deleteMessage", async (request: Request, response: Response) => {
    await sender(queueUrls);
    
    response.status(200);
    response.send("queueUrls Message is Deleted");
  });
};