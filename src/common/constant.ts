const CommonConstant = {
  /**
   * @description
   * 메세지 풀링 시간
   */
  MESSAGE_PULLING_TIME: 3000 * 10,
  /**
   * @description
   * 메세지 가져오는 갯수
   */
  RECEIVE_MAX_NUMBER_OF_MESSAGES: 1,
  /**
   * @description
   * 메세지가 없을 때 지연 시간
   */
  DELAY_START_INTERVAL_TIME: 6000 * 10,
  /**
   * @description
   * 메세지 삭제 실패 시 지연 시간
   */
  DELAY_DELETE_MESSAGE_TIME: 3000 * 10,
  /**
   * @description
   * 최대 메세지 삭제 시도 횟수
   */
  MAXIMUM_DELETE_COUNT: 5,
};

export default CommonConstant;
