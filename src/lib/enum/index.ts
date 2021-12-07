import * as Error from "./error";
import * as Message from "./message";
import * as Queue from "./queue";

// todo: enum -> type으로 리팩토링할 수 있는건 리팩토링하기
export default {
  ...Error,
  ...Message,
  ...Queue,
};
