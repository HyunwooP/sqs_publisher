export type CommonWorkerRoute = {
  path: string;
  method: "get" | "post" | "put" | "delete" | "patch";
};

const CommonWorkerRoutes: CommonWorkerRoute[] = [
  {
    path: "/sendSQSMessage",
    method: "post",
  },
];

export default CommonWorkerRoutes;
