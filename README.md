# Node-SQS

## [Note]

### Description

```
1. DLQ Messages in this project are not moved back to the Standard Queue, but have messages in the DLQ and are processed in the same way as the Standard Queue in the process. (Personally, in order to prevent repeated failures and duplicate messages)
2. The DLQ Message does not move to the standard queue.
3. The default environment for build is the localhost environment.
```

## Author

```
2021.11.19 -> 
Author: Hyunwoo Park
```

## Getting Started

```
1. yarn install
2. yarn start
3. If you run it with docker-compose Please check each container environment.
  3-1. docker-compose.app.yml = Create and run only nodejs(app) container.
  3-2. docker-compose.elasticmq.yml = Create and run only elasticmq container.
  3-3. docker-compose.full.system.yml = Create and run each container for elasticmq, and nodejs(app)
  3-4. Docker environment variables are managed and used in src/config.
4. You can turn it on with a shell file in the scripts folder.
```
