export interface CommonWorkerRouteIE {
  path: string;
  method: "get" | "post" | "put" | "delete" | "patch";
}
const CommonWorkerRoutes: CommonWorkerRouteIE[] = [
  {
    path: "/getSQSMessage",
    method: "post",
  },
];

export default CommonWorkerRoutes;

