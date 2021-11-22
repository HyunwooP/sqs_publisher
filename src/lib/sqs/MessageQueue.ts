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
  private readonly sqs: AWS.SQS = SQSInstance.getSQSInstance();

  /**
   * @description
   * * Get Queue List
   * @returns {Promise<GetQueueResponse>}
   */
  getQueues = async (): Promise<GetQueueResponse> =>
    await this.sqs.listQueues().promise();

  /**
   * @description
   * * Create Queue
   * @param {CreateQueueRequest} params
   * @param {(AWSError, CreateQueueResult) => void} callback
   * @returns {Promise<CreateQueueResult>}
   */
  createQueue = async (
    params: CreateQueueRequest,
    callback?: (error: AWSError, data: CreateQueueResult) => void,
  ): Promise<CreateQueueResult> =>
    await this.sqs.createQueue(params, callback).promise();

  /**
   * @description
   * * Delete Queue
   * @param {DeleteQueueRequest} params
   * @param {(AWSError, VoidResponse) => void} callback
   * @returns {Promise<VoidResponse>}
   */
  deleteQueue = async (
    params: DeleteQueueRequest,
    callback?: (error: AWSError, data: DeleteQueueRequest) => void,
  ): Promise<VoidResponse> => await this.sqs.deleteQueue(params, callback);

  /**
   * @description
   * * Get Message
   * @param {ReceiveMessageRequest} params
   * @param {(AWSError, ReceiveMessageResult) => void} callback
   * @returns {Promise<ReceiveMessageResult>}
   */
  getMessage = async (
    params: ReceiveMessageRequest,
    callback?: (error: AWSError, data: ReceiveMessageResult) => void,
  ): Promise<ReceiveMessageResult> =>
    await this.sqs.receiveMessage(params, callback).promise();

  /**
   * @description
   * * Message Queue안에 Message Insert
   * @param {SendMessageRequest} params
   * @param {(AWSError, SendMessageResult) => void} callback
   * @returns {Promise<SendMessageResult>}
   */
  sendMessage = async (
    params: SendMessageRequest,
    callback?: (error: AWSError, data: SendMessageResult) => void,
  ): Promise<SendMessageResult> =>
    await this.sqs.sendMessage(params, callback).promise();

  /**
   * @description
   * * 해당 Delete는 가시성 (time)을 계산하여 지운다. 즉각적인 삭제처리가 안됨.
   * @param {DeleteMessageRequest} params
   * @param {(AWSError, VoidResponse) => void} callback
   * @returns {Promise<VoidResponse>}
   */
  deleteMessage = async (
    params: DeleteMessageRequest,
    callback?: (error: AWSError, data: VoidResponse) => void,
  ): Promise<VoidResponse> => await this.sqs.deleteMessage(params, callback);

  /**
   * @description
   * * 바로 삭제 처리
   * @param {DeleteMessageBatchRequest} params
   * @param {(AWSError, DeleteMessageBatchResult) => void} callback
   * @returns {Promise<DeleteMessageBatchResult>}
   */
  deleteMessageBatch = async (
    params: DeleteMessageBatchRequest,
    callback?: (error: AWSError, data: DeleteMessageBatchResult) => void,
  ): Promise<DeleteMessageBatchResult> =>
    await this.sqs.deleteMessageBatch(params, callback).promise();
}

export default new MessageQueue();
