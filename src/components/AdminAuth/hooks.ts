import { useAtom } from "jotai";
import { fetchingAtom, userAtom } from "../../states";
import { useUserDataFns } from "../hooks/useUserDataFns";

export const useOnAuthSubmit = () => {
  const { adminUserAuth } = useUserDataFns();
  return { onSubmit: () => {} };
};
