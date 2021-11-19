# SQS_PUBLISHER
#### Publishing Message -> SQS Queue
##### Author 박현우
#
### 개발 환경
* node 14+
* typescript
* elasticmq
* docker
#
### 내용
* 샘플 메세지를 미리 생성한 SQS Message Queue 안에 집어 넣는다.
* 메세지를 풀링
#
### todo
* subscribe 서버 만들기
* publisher 서버 만들기
* statefull, stateless 두 가지 방식으로 메세지를 전달하는 프로세스 만들기 (환경 변수에 의하여 제어)
* 현재는 타이머로 풀링하지만, Publisher 서버가 전송했음을 SQS 서버에 알리면, (socket or restful)
* 그 때 message를 꺼내서 전처리하여 subscribe로 보내는 프로세스를 시작하는 건 어떨지...