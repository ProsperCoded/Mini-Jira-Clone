export type ApiErrorDetail = {
  cause: unknown;
  name: string;
  path: string;
  statusCode: number;
};

export type ApiResponse<T = any> = {
  message: string;
  status: "success" | "error";
  statusCode: number;
  data?: T;
  error?: ApiErrorDetail;
};
