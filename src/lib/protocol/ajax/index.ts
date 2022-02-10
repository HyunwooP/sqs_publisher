import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import * as _ from "lodash";
import { UnknownObject } from "../../../lib/common/type";
import errorController from "../../common/error";
import { ErrorStatus } from "../../enum/error";
import env from "../../env";

const generateQueryEndPoint = (endPoint: string, params: UnknownObject): string => {
  let _endPoint = `${endPoint}?`;

  Object.keys(params).forEach((key: string, index: number) => {
    if (index === 0) {
      _endPoint += `${key}=${params[key]}`;
    } else {
      _endPoint += `&${key}=${params[key]}`;
    }
  });

  return _endPoint;
};

const instance: AxiosInstance = axios.create({
  baseURL: env.SUB_SCRIBE_A_SERVER_ORIGIN,
});

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => config,
  (error: AxiosError) => {
    console.log(`Axios Request Error ========> ${error.message} ${error.code}`);
    return Promise.reject(ErrorStatus.HTTP_REQUEST_PROTOCOL_ERROR);
  },
);

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.log(
      `Axios Response Error ========> ${error.message} ${error.code}`,
    );
    return Promise.reject(ErrorStatus.HTTP_RESPONSE_PROTOCOL_ERROR);
  },
);

export const getAPI = async (
  endPoint: string = "",
  params: UnknownObject,
  axiosOption: AxiosRequestConfig,
): Promise<unknown> => {
  try {
    const getEndPoint = _.isEmpty(params)
      ? endPoint
      : generateQueryEndPoint(endPoint, params);
    const result: AxiosResponse = await instance.get(getEndPoint, axiosOption);
    return await generateAPIData(result);
  } catch (error: unknown) {
    errorController(error);
  }
};

export const deleteAPI = async (
  endPoint: string = "",
  params: UnknownObject,
  axiosOption: AxiosRequestConfig,
): Promise<unknown> => {
  try {
    const deleteEndPoint = _.isEmpty(params)
      ? endPoint
      : generateQueryEndPoint(endPoint, params);
    const result: AxiosResponse = await instance.delete(
      deleteEndPoint,
      axiosOption,
    );
    return await generateAPIData(result);
  } catch (error: unknown) {
    errorController(error);
    throw error;
  }
};

export const postAPI = async (
  endPoint: string = "",
  data: UnknownObject,
  axiosOption: AxiosRequestConfig = {
    timeout: 2000,
  },
): Promise<unknown> => {
  try {
    const result: AxiosResponse = await instance.post(
      endPoint,
      data,
      axiosOption,
    );
    return await generateAPIData(result);
  } catch (error: unknown) {
    errorController(error);
    throw error;
  }
};

export const putAPI = async (
  endPoint: string = "",
  data: UnknownObject,
  axiosOption: AxiosRequestConfig = {
    timeout: 2000,
  },
): Promise<unknown> => {
  try {
    const result: AxiosResponse = await instance.put(
      endPoint,
      data,
      axiosOption,
    );
    return await generateAPIData(result);
  } catch (error: unknown) {
    errorController(error);
    throw error;
  }
};

export const patchAPI = async (
  endPoint: string = "",
  data: UnknownObject,
  axiosOption: AxiosRequestConfig = {
    timeout: 2000,
  },
): Promise<unknown> => {
  try {
    const result: AxiosResponse = await instance.patch(
      endPoint,
      data,
      axiosOption,
    );
    return await generateAPIData(result);
  } catch (error: unknown) {
    errorController(error);
    throw error;
  }
};

export const generateAPIData = async (response: AxiosResponse) => {
  // * 확장할 것이 있으면 여기에 작성
  return response.data;
};
