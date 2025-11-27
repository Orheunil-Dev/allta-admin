import Axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export type Error = {
  message: string | null;
  status: number;
  code?: string;
};

interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const REFRESH_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// 토큰 재발급
const getNewAccessToken = async (): Promise<void> => {
  try {
    await REFRESH_INSTANCE.post("auth/refresh");
  } catch (e) {
    throw {
      message: "로그인이 만료되었습니다.",
      status: 401,
      code: "TOKEN_REFRESH_FAILED",
    } as Error;
  }
};

// Response 인터셉터
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;

    if (!originalRequest) return Promise.reject(error);

    // 401 에러 && 아직 재발급 시도 안함
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await getNewAccessToken();

        return AXIOS_INSTANCE(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    if (error.response?.status === 401 && originalRequest._retry) {
      return Promise.reject({
        message: "로그인이 만료되었습니다.",
        status: 401,
        code: "TOKEN_REFRESH_FAILED",
      } as Error);
    }

    return Promise.reject(error);
  }
);

export const customInstance = async <T = any>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await AXIOS_INSTANCE({
      ...config,
      ...options,
    });

    return response.data;
  } catch (error) {
    if ((error as any)?.code === "TOKEN_REFRESH_FAILED") {
      // 여기서 바로 로그인 페이지로 보내도록 처리할 수 있음
      throw error;
    }

    if ((error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError;
      const message =
        (axiosError.response?.data as any)?.message ?? "오류가 발생했습니다.";
      const status = axiosError.response?.status ?? 500;

      throw { message, status } as Error;
    }

    const message = (error as any)?.message ?? "오류가 발생했습니다.";
    const status = (error as any)?.status ?? 500;

    throw { message, status } as Error;
  }
};

export default customInstance;
