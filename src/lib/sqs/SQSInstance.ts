import * as AWS from "aws-sdk";
import _ from "lodash";
import CommonEnum from "../enum";
import env from "../env";

class SQSInstance {
  private readonly sqs: AWS.SQS;

  constructor() {
    if (_.isEmpty(env.AWS_ACCESS_KEY) || _.isEmpty(env.AWS_SECRET_KEY)) {
      throw new Error(CommonEnum.ErrorStatus.IS_NOT_VALID_REQUIRE_AWS_KEY);
    }

    if (_.isEmpty(env.SQS_END_POINT) || _.isEmpty(env.SQS_REGION)) {
      throw new Error(
        CommonEnum.ErrorStatus.IS_NOT_VALID_REQUIRE_AWS_ENDPOINT_INFO,
      );
    }

    AWS.config.update({
      accessKeyId: env.AWS_ACCESS_KEY,
      secretAccessKey: env.AWS_SECRET_KEY,
    });

    this.sqs = new AWS.SQS({
      endpoint: env.SQS_END_POINT,
      region: env.SQS_REGION,
    });
  }

  get instance(): AWS.SQS {
    return this.sqs;
  }
}

export default new SQSInstance();
