import cors from "cors";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import { Server } from "http";
import _ from "lodash";
import path from "path";
import env from "../../env";
import middlewareController from "./middleware";
import CommonWorkerRoutes, { CommonWorkerRoute } from "./routes";

const httpController = (): Server => {
  const app: Application = createExpress();
  return createExpressServer(app);
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

const createExpressServer = (app: Application): Server => {
  const port = env.SQS_SERVER_PORT;
  return app.listen(port, () => {
    console.log(`SQS SERVER PORT ${port}`);
  });
};

export const createRouteForPublisher = ({
  queueUrls,
  action,
}: {
  queueUrls: string[];
  action: Function;
}): void => {
  const app: Application = createExpress();

  _.forEach(
    CommonWorkerRoutes,
    async (CommonWorkerRoute: CommonWorkerRoute) => {
      app[CommonWorkerRoute.method](
        CommonWorkerRoute.path,
        middlewareController,
        async (req: Request, res: Response) => {
          const result = await action(queueUrls);

          res.status(200);
          res.send(result);
        },
      );
    },
  );
};

export default httpController;
