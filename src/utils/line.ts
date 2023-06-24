const verifyURL = "https://api.line.me/oauth2/v2.1/verify";
const getUserInfoURL = "https://api.line.me/oauth2/v2.1/userinfo";

type LineAPIFailError = { message: string };
type LineAPIFail = { status: "fails"; errors: LineAPIFailError[] };

export type VerifyTokenFail = LineAPIFail;
export type VerifyTokenSuccess = {
  status: "success";
  data: {
    scope: string;
    clientId: string;
    expiresIn: string;
  };
};
export type VerifyTokenFn = (
  accessToken: string
) => Promise<VerifyTokenFail | VerifyTokenSuccess>;
export const verifyToken: VerifyTokenFn = async (accessToken) => {
  try {
    const response = await fetch(`${verifyURL}?access_token=${accessToken}`);
    if (response.status !== 200) {
      return { status: "fails", errors: [{ message: "" }] };
    }

    const {
      scope,
      client_id: clientId,
      expires_in: expiresIn,
    } = await response.json();
    return { status: "success", data: { scope, clientId, expiresIn } };
  } catch (error) {
    return buildCatchError(error);
  }
};

export type GetProfileFail = LineAPIFail;
export type GetProfileSuccess = {
  status: "success";
  data: {
    sub: string;
    name: string;
    picture: string;
  };
};
export type GetProfileFn = (
  accessToken: string
) => Promise<GetProfileFail | GetProfileSuccess>;
export const getProfile: GetProfileFn = async (accessToken) => {
  try {
    const response = await fetch(getUserInfoURL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (response.status !== 200) return { status: "fails", errors: [] };

    const data = await response.json();
    return { status: "success", data };
  } catch (error) {
    return buildCatchError(error);
  }
};

const buildCatchError = (error: unknown) => {
  const errors: LineAPIFailError[] = [];
  if (error instanceof Error) {
    errors.push({ message: error.message });
  }
  return { status: "fails", errors } as LineAPIFail;
};
