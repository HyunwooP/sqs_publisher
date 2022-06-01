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
  VoidResponse,
} from "./type";

class MessageQueue {
  private readonly sqs: AWS.SQS = SQSInstance.instance;

  async getQueues(): Promise<GetQueueResponse> {
    return await this.sqs.listQueues().promise();
  }

  async createQueue(
    params: CreateQueueRequest,
    callback?: (error: AWSError, data: CreateQueueResult) => void,
  ): Promise<CreateQueueResult> {
    return await this.sqs.createQueue(params, callback).promise();
  }

  async deleteQueue(
    params: DeleteQueueRequest,
    callback?: (error: AWSError, data: UnknownObject) => void,
  ): Promise<VoidResponse> {
    return await this.sqs.deleteQueue(params, callback);
  }

  async getMessage(
    params: ReceiveMessageRequest,
    callback?: (error: AWSError, data: ReceiveMessageResult) => void,
  ): Promise<ReceiveMessageResult> {
    return await this.sqs.receiveMessage(params, callback).promise();
  }

  async sendMessage(
    params: SendMessageRequest,
    callback?: (error: AWSError, data: SendMessageResult) => void,
  ): Promise<SendMessageResult> {
    return await this.sqs.sendMessage(params, callback).promise();
  }

  /**
   * @description
   * 해당 Delete는 가시성 (time)을 계산하여 지운다. 즉각적인 삭제처리가 안됨.
   */
  async deleteMessage(
    params: DeleteMessageRequest,
    callback?: (error: AWSError, data: UnknownObject) => void,
  ): Promise<VoidResponse> {
    return await this.sqs.deleteMessage(params, callback);
  }

  /**
   * @description
   * 바로 삭제 처리
   */
  async deleteMessageBatch(
    params: DeleteMessageBatchRequest,
    callback?: (error: AWSError, data: DeleteMessageBatchResult) => void,
  ): Promise<DeleteMessageBatchResult> {
    return await this.sqs.deleteMessageBatch(params, callback).promise();
  }
}

export default new MessageQueue();
