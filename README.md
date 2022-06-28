# Node-SQS
#### Publishing Message -> SQS & Message Broker -> Message Action Server (Subscriber)
##### Author 박현우
##### Create Date 2021.11.19
#
### 개발 환경
* node 14+
* typescript
* dotenv
* elasticmq
* docker
* nodemon
* ws
* express
#
### 내용
* 샘플 메세지를 미리 생성한 SQS Message Queue 안에 집어 넣는다.
* 메세지를 풀링
* [node-message-action](https://github.com/awakelife93/node-message-action)에게로 전송한다.
* 해당 프로젝트에서의 DLQ Message들은 Standard Queue로 다시 옮기지 않고, DLQ에 메세지를 갖게하여 프로세스에서는 Standard Queue와 동일하게 처리시킨다. (개인적인 생각으로 반복 실패와 중복 메세지 방지하기 위하여)
* The DLQ Message does not move to the standard queue.

#
### todo
#
### 실행
* (please confirm dotenv file / dotenv configuration is same src/config file)
* docker build
* run docker
* npm install
* npm start (nodemon을 쓰고 개발중이니, 없을 경우 nodemon -> node)

