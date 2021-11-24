import cors from "cors";
import express from "express";
import http from "http";
import path from "path";
import env from "../../env";

const httpController = (): http.Server => {
  const app: express.Application = createExpress();
  return createExpressServer(app);
};

const createExpress = (): express.Application => {
  const corsConfig = {
    // * subscribe servers origin
    origin: [env.SUB_SCRIBE_A_SERVER_ORIGIN],
    credentials: true,
  };

  const app: express.Application = express();

  app.use(cors(corsConfig));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "public")));

  return app;
};

const createExpressServer = (app: express.Application): http.Server => {
  const port = env.SQS_SERVER_PORT;
  return app.listen(port, () => {
    console.log(`SQS SERVER PORT ${port}`);
  });
};

export default httpController;
