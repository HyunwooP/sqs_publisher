# SQS_PUBLISHER
#### Publishing Message -> SQS Queue -> SubScribe Server to Message
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
* [SQS_SUBSCRIBE](https://github.com/awakelife93/sqs_subscribe)에게로 전송한다.
#
### todo
* 현재는 타이머로 풀링하지만, Publisher 서버가 전송했음을 SQS 서버에 알리면, (socket or restful)
* 그 때 message를 꺼내서 전처리하여 subscribe로 보내는 프로세스를 시작하는 건 어떨지...
#
### 실행
* (please confirm .env file / .env configuration is same src/env file)
* docker build
* run docker
* npm install
* npm start (nodemon을 쓰고 개발중이니, 없을 경우 nodemon -> node)

