import SQSInstance from "./SQSInstance";
import env from "../../env";
import {
  ReceiveMessageRequest,
  ReceiveMessageResult,
  SendMessageRequest,
  SendMessageResult,
  CreateQueueRequest,
  CreateQueueResult,
  DeleteMessageRequest,
  DeleteQueueRequest,
  AWSError,
  GetQueueResponse,
  ReceiveMessageResponse,
  VoidResponse,
  SendMessageResponse,
  CreateQueueResponse,
} from "./type";

class MessageQueue {
  private readonly sqs: AWS.SQS = SQSInstance.getSQSInstance(env.SQS_END_POINT);

  getQueues = async (): Promise<GetQueueResponse> => await this.sqs.listQueues().promise();

  createQueue = async (
    params: CreateQueueRequest,
    callback?: (
      error: AWSError,
      data: CreateQueueResult
    ) => void
  ): Promise<CreateQueueResponse> => await this.sqs.createQueue(params, callback);

  deleteQueue = async (
    params: DeleteQueueRequest,
    callback?: (
      error: AWSError,
      data: DeleteQueueRequest
    ) => void
  ): Promise<VoidResponse> => await this.sqs.deleteQueue(params, callback);

  getMessage = async (
    params: ReceiveMessageRequest,
    callback?: (
      error: AWSError,
      data: ReceiveMessageResult
    ) => void
  ): Promise<ReceiveMessageResponse> => await this.sqs.receiveMessage(params, callback).promise();

  sendMessage = async (
    params: SendMessageRequest,
    callback?: (
      error: AWSError,
      data: SendMessageResult
    ) => void
  ): Promise<SendMessageResponse> => {
    return await this.sqs.sendMessage(params, callback);
  };

  deleteMessage = async (
    params: DeleteMessageRequest,
    callback?: (
      error: AWSError,
      data: {}
    ) => void
  ): Promise<VoidResponse> => await this.sqs.deleteMessage(params, callback);
};

export default new MessageQueue();