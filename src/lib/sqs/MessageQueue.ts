import { UnknownObject } from "../common/type";
import SQSInstance from "./SQSInstance";
import {
  AWSError,
  CreateQueueRequest,
  CreateQueueResult,
  DeleteMessageBatchRequest,
  DeleteMessageBatchResult,
  DeleteMessageRequest,
  DeleteQueueRequest,
  GetQueueResponse,
  ReceiveMessageRequest,
  ReceiveMessageResult,
  SendMessageRequest,
  SendMessageResult,
  VoidResponse
} from "./type";

class MessageQueue {
  private readonly sqs: AWS.SQS = SQSInstance.instance;

  getQueues = async (): Promise<GetQueueResponse> =>
    await this.sqs.listQueues().promise();

  createQueue = async (
    params: CreateQueueRequest,
    callback?: (error: AWSError, data: CreateQueueResult) => void,
  ): Promise<CreateQueueResult> =>
    await this.sqs.createQueue(params, callback).promise();

  deleteQueue = async (
    params: DeleteQueueRequest,
    callback?: (error: AWSError, data: UnknownObject) => void,
  ): Promise<VoidResponse> => await this.sqs.deleteQueue(params, callback);

  getMessage = async (
    params: ReceiveMessageRequest,
    callback?: (error: AWSError, data: ReceiveMessageResult) => void,
  ): Promise<ReceiveMessageResult> =>
    await this.sqs.receiveMessage(params, callback).promise();

  sendMessage = async (
    params: SendMessageRequest,
    callback?: (error: AWSError, data: SendMessageResult) => void,
  ): Promise<SendMessageResult> =>
    await this.sqs.sendMessage(params, callback).promise();

  /**
   * @description
   * 해당 Delete는 가시성 (time)을 계산하여 지운다. 즉각적인 삭제처리가 안됨.
   */
  deleteMessage = async (
    params: DeleteMessageRequest,
    callback?: (error: AWSError, data: UnknownObject) => void,
  ): Promise<VoidResponse> => await this.sqs.deleteMessage(params, callback);

  /**
   * @description
   * 바로 삭제 처리
   */
  deleteMessageBatch = async (
    params: DeleteMessageBatchRequest,
    callback?: (error: AWSError, data: DeleteMessageBatchResult) => void,
  ): Promise<DeleteMessageBatchResult> =>
    await this.sqs.deleteMessageBatch(params, callback).promise();
}

export default new MessageQueue();
