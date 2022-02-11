export type CommonWorkerRoute = {
  path: string;
  method: "get" | "post" | "put" | "delete" | "patch";
};

const CommonWorkerRoutes: CommonWorkerRoute[] = [
  {
    path: "/getSQSMessage",
    method: "post",
  },
];

export default CommonWorkerRoutes;
