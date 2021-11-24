import * as AWS from "aws-sdk";
import _ from "lodash";
import env from "../../env";
import CommonEnum from "../enum";

class SQSInstance {
  constructor() {
    if (_.isEmpty(env.AWS_ACCESS_KEY) || _.isEmpty(env.AWS_SECRET_KEY)) {
      throw new Error(CommonEnum.ErrorStatus.IS_NOT_VALID_REQUIRE_AWS_KEY);
    }

    AWS.config.update({
      accessKeyId: env.AWS_ACCESS_KEY,
      secretAccessKey: env.AWS_SECRET_KEY,
    });
  }

  readonly getSQSInstance = (): AWS.SQS => {
    if (_.isEmpty(env.SQS_END_POINT) || _.isEmpty(env.SQS_REGION)) {
      throw new Error(
        CommonEnum.ErrorStatus.IS_NOT_VALID_REQUIRE_AWS_ENDPOINT_INFO,
      );
    }

    return new AWS.SQS({
      endpoint: env.SQS_END_POINT,
      region: env.SQS_REGION,
    });
  };
}

export default new SQSInstance();
