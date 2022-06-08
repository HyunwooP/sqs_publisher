import "dotenv/config";

export default {
  port: process.env.port ?? 5000,
  SQS_END_POINT: process.env.SQS_END_POINT ?? "http://localhost:9324",
  SQS_REGION: process.env.SQS_REGION ?? "us-east-1",
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY ?? undefined,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY ?? undefined,
  IS_SETUP_QUEUE_DEFAULT_ATTRIBUTES: process.env.IS_SETUP_QUEUE_DEFAULT_ATTRIBUTES === "true" ? true : false,
  // * true = socket, false = restful
  IS_SEND_TO_SOCKET_SUBSCRIBE:
    process.env.IS_SEND_TO_SOCKET_SUBSCRIBE === "true" ? true : false,
  // * true = pulling, false = restful
  IS_PULLING_MESSAGE: process.env.IS_PULLING_MESSAGE === "true" ? true : false,
  // * 해당 서버가 지켜보는 Subscribe A 서버 Origin
  SUB_SCRIBE_A_SERVER_ORIGIN:
    process.env.subscribeDomain && process.env.subscribePort
      ? `http://${process.env.subscribeDomain}:${process.env.subscribePort}`
      : "http://localhost:3001",
  // * 해당 서버를 바라보는 Publisher 서버 Origin (Http로 push를 요청할 경우.)
  PUBLISHER_SERVER_ORIGIN:
    process.env.publisherDomain && process.env.publisherPort
      ? `http://${process.env.publisherDomain}:${process.env.publisherPort}`
      : "http://localhost:3002",
  PARAMS_SPLIT_TYPE: process.env.PARAMS_SPLIT_TYPE ?? "/",
};
