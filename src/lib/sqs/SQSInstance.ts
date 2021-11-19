import * as AWS from "aws-sdk";
import env from "../../env";

class SQSInstance {
  constructor() {
    AWS.config.update({
      accessKeyId: env.AWS_ACCESS_KEY,
      secretAccessKey: env.AWS_SECRET_KEY,
      region: env.SQS_REGION
    });
  };

  getSQSInstance = (endpoint: string): any => {
    return new AWS.SQS({
      endpoint
    });
  };
};

export default new SQSInstance();