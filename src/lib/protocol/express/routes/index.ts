export type CommonWorkerRoute = {
  path: string;
  method: "get" | "post" | "put" | "delete" | "patch";
};

const CommonWorkerRoutes: CommonWorkerRoute[] = [
  {
    // * queue에서 message 제거 후, message를 subscribe server로 요청
    path: "/deleteMessage",
    method: "post",
  },
];

export default CommonWorkerRoutes;
