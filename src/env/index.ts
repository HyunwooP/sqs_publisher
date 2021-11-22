import "dotenv/config";

export default {
  SQS_END_POINT: process.env.SQS_END_POINT ?? "http://localhost:9324",
  SQS_REGION: process.env.SQS_REGION ?? "us-east-1",
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY ?? null,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY ?? null,
  // * true = socket, false = restful
  IS_SEND_TO_SOCKET_SUBSCRIBE:
    process.env.IS_SEND_TO_SOCKET_SUBSCRIBE === "true" ?? true,
};
