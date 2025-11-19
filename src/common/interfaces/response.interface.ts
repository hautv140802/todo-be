export interface Response<T> {
  status_code: number;
  message: string;
  data: T;
  timestamp: string;
}
