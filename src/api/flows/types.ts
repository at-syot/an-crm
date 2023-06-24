type FlowResponseStatus = { status: number };
export type FlowResponseFail = FlowResponseStatus & {
  errors: { message?: string }[];
};
type FlowResponseSuccess<DT> = FlowResponseStatus & {
  message: string;
  data?: DT;
};

export type FlowResponse<DT> = FlowResponseSuccess<DT> | FlowResponseFail;
