# NODE-SQS
#### Publishing Message -> SQS Queue -> Subscribe Server to Message
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
* [node-sqs-message-action](https://github.com/awakelife93/node-sqs-message-action)에게로 전송한다.
#
### todo
#
### 실행
* (please confirm .env file / .env configuration is same src/lib/env file)
* docker build
* run docker
* npm install
* npm start (nodemon을 쓰고 개발중이니, 없을 경우 nodemon -> node)

