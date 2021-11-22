import SQSInstance from "./SQSInstance";
import {
  AWSError,
  CreateQueueRequest,
  CreateQueueResponse,
  CreateQueueResult,
  DeleteMessageRequest,
  DeleteQueueRequest,
  GetQueueResponse,
  ReceiveMessageRequest,
  ReceiveMessageResponse,
  ReceiveMessageResult,
  SendMessageRequest,
  SendMessageResponse,
  SendMessageResult,
  VoidResponse,
} from "./type";

class MessageQueue {
  private readonly sqs: AWS.SQS = SQSInstance.getSQSInstance();

  getQueues = async (): Promise<GetQueueResponse> =>
    await this.sqs.listQueues().promise();

  createQueue = async (
    params: CreateQueueRequest,
    callback?: (error: AWSError, data: CreateQueueResult) => void,
  ): Promise<CreateQueueResponse> =>
    await this.sqs.createQueue(params, callback).promise();

  deleteQueue = async (
    params: DeleteQueueRequest,
    callback?: (error: AWSError, data: DeleteQueueRequest) => void,
  ): Promise<VoidResponse> => await this.sqs.deleteQueue(params, callback);

  getMessage = async (
    params: ReceiveMessageRequest,
    callback?: (error: AWSError, data: ReceiveMessageResult) => void,
  ): Promise<ReceiveMessageResponse> =>
    await this.sqs.receiveMessage(params, callback).promise();

  sendMessage = async (
    params: SendMessageRequest,
    callback?: (error: AWSError, data: SendMessageResult) => void,
  ): Promise<SendMessageResponse> =>
    await this.sqs.sendMessage(params, callback).promise();

  deleteMessage = async (
    params: DeleteMessageRequest,
    callback?: (error: AWSError, data: {}) => void,
  ): Promise<VoidResponse> => await this.sqs.deleteMessage(params, callback);
}

export default new MessageQueue();
