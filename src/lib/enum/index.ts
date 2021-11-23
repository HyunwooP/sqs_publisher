import * as Cache from "./cache";
import * as Error from "./error";
import * as Message from "./message";
import * as Queue from "./queue";

export default {
  ...Cache,
  ...Error,
  ...Message,
  ...Queue
};