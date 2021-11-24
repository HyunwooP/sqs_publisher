import "dotenv/config";

export default {
  SQS_END_POINT: process.env.SQS_END_POINT ?? "http://localhost:9324",
  SQS_REGION: process.env.SQS_REGION ?? "us-east-1",
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY ?? null,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY ?? null,
  // * true = socket, false = restful
  IS_SEND_TO_SOCKET_SUBSCRIBE:
    process.env.IS_SEND_TO_SOCKET_SUBSCRIBE === "true" ?? true,
  // * 바라보는 Subscribe A 서버 Origin
  SUB_SCRIBE_A_SERVER_ORIGIN:
    process.env.subscribeDomain && process.env.subscribePort
      ? `http://${process.env.subscribeDomain}:${process.env.subscribePort}`
      : "http://localhost:3001",
  // * 해당 서버 PORT
  SQS_SERVER_PORT: process.env.SQS_SERVER_PORT ?? 3000,
};
