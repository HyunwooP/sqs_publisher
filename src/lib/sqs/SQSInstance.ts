import * as AWS from "aws-sdk";
import env from "../../env";

class SQSInstance {
  constructor() {
    AWS.config.update({
      accessKeyId: env.AWS_ACCESS_KEY,
      secretAccessKey: env.AWS_SECRET_KEY,
    });
  };

  readonly getSQSInstance = (): AWS.SQS => {
    return new AWS.SQS({
      endpoint: env.SQS_END_POINT,
      region: env.SQS_REGION,
    });
  };
};

export default new SQSInstance();