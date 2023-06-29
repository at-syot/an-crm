type FlowResponseStatus = { status: number };
export type FlowResponseFail = FlowResponseStatus & {
  errors: { message?: string }[];
};
export type FlowResponseSuccess<DT> = FlowResponseStatus & {
  message: string;
  data?: DT;
};

export type FlowResponse<DT> = FlowResponseSuccess<DT> | FlowResponseFail;
export function isFlowFailResponse(resp: unknown): resp is FlowResponseFail {
  return (resp as FlowResponseFail).errors !== undefined;
}
