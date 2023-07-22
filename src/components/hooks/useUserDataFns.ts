import { useAtom } from "jotai";
import { fetchingAtom } from "../../states";

export const useUserDataFns = () => {
  const { adminUserAuth } = useAdminUserAuthAction();
  return {
    adminUserAuth,
  };
};

const useAdminUserAuthAction = () => {
  const [, setFetching] = useAtom(fetchingAtom);

  const doAdminUserAuth = async (username: string, password: string) => {
    setFetching(true);
    const response = await fetch("/api/admins/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const json: unknown = await response.json();
    setFetching(false);

    console.log(response, json);
    return json;
  };
  return { adminUserAuth: doAdminUserAuth };
};
