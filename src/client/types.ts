export type ClientFailResponse = {
  status: "fail";
  errors: { message?: string }[];
};
export type ClientSuccessResponse<DT> = {
  status: "success";
  message: string;
  data?: DT;
};
export type ClientResponse<DT> = ClientFailResponse | ClientSuccessResponse<DT>;

export function isClientFailResponse(
  response: unknown
): response is ClientFailResponse {
  return (response as ClientFailResponse).errors !== undefined;
}
export function isClientSuccessResponse<DT>(
  response: unknown
): response is ClientSuccessResponse<DT> {
  return (response as ClientSuccessResponse<DT>).message !== undefined;
}
