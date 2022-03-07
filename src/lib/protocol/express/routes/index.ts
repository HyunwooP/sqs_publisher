export type CommonWorkerRoute = {
  path: string;
  method: "get" | "post" | "put" | "delete" | "patch";
};

const CommonWorkerRoutes: CommonWorkerRoute[] = [
  {
    path: "/start",
    method: "post",
  },
];

export default CommonWorkerRoutes;
